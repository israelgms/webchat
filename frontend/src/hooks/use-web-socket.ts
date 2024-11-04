"use client";

import { useEffect, useState } from "react";

import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { toast } from "./use-toast";
import { Message } from "@/types/message";

export default function useWebsocket({
  channel,
  username,
}: {
  channel: string;
  username?: string;
}) {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<Message[] | []>([]);

  useEffect(() => {
    if (!username || !channel) return;

    const socket = io("http://localhost:3001", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 2,
    });

    setSocket(socket);

    socket.emit("join", { username, channel });

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/messages/${channel}`
        );
        if (!response.ok) throw new Error("Failed to fetch messages");
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast({
          variant: "destructive",
          title: "Error fetching messages.",
        });
      }
    };

    fetchMessages();

    socket.on(`message:${channel}`, (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off(`message:${channel}`);
      socket.disconnect();
    };
  }, [username, channel]);

  const sendMessage = (text: string) => {
    if (!socket) {
      toast({
        variant: "destructive",
        title: "Socket is not defined. Contact your administrator",
      });

      return;
    }

    const message = {
      username,
      text,
      time: new Date().toISOString(),
      channel,
    };

    socket.emit("message", message);
  };

  return { messages, sendMessage };
}
