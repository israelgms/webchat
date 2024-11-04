"use client";

import { EnterChannelForm } from "@/components/ui/enter-channel-form";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center p-24">
      <div className="text-center mb-10">
        <h1 className="text-6xl">Welcome to Webchat</h1>
        <p className="text-xl">Enter your name and channel for join</p>
      </div>

      <EnterChannelForm />
    </div>
  );
}
