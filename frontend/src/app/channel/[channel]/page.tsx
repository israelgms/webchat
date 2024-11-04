"use client";

import { Input } from "@/components/ui/input";
import useWebsocket from "@/hooks/use-web-socket";
import { Message } from "@/types/message";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MessageProps {
  message: Message;
  currentUsername: string;
}

function BubbleChat(props: MessageProps) {
  const date = new Date(props.message.time);
  const formattedDate = format(date, "dd/MM/yyyy '-' HH:mm:ss", {
    locale: ptBR,
  });

  return (
    <div className="w-fit p-4 border border-neutral-500 rounded-sm">
      <span className="text-base text-blue-900">
        {props.message.username}:{" "}
      </span>
      <span className="text-sm">{props.message.text}</span>
      <hr className="my-1" />
      <span className="block text-xs text-blue-500">{formattedDate}</span>
    </div>
  );
}

interface PageProps {
  params: { channel: string };
  searchParams: {
    username?: string;
  };
}

export default function Page(props: PageProps) {
  const username = props.searchParams?.username;
  const channel = props.params.channel;

  const { push } = useRouter();

  const { messages, sendMessage } = useWebsocket({ channel, username });
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      sendMessage(inputValue);
      setInputValue("");
    }
  };

  if (!channel || !username) {
    return push("/");
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl mb-10">
        Welcome <strong className="text-blue-950">{username}</strong>, your current channel is: <strong className="text-blue-950">{channel}</strong>
      </h1>
      <div className="flex flex-col justify-between h-2/3 w-2/3 shadow-2xl border-neutral-700 relative">
        <div className="flex flex-col gap-2 p-2 overflow-hidden overflow-y-auto">
          {messages.map((message) => (
            <BubbleChat
              message={message}
              key={message.id}
              currentUsername={username}
            />
          ))}
        </div>

        <div className="w-full p-2">
          <Input
            placeholder="Type your message and press enter"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
}
