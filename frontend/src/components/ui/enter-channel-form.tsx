"use client";

import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useRouter } from "next/navigation";

const FormSchema = z.object({
  name: z.string({
    required_error: "Please enter your name",
  }),
  channel: z.string({
    required_error: "Please select your channel",
  }),
});

export function EnterChannelForm() {
  const { push } = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    push(`channel/${data.channel}?username=${data.name}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-96">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <Input placeholder="Digite seu nome" {...field} required />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="channel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Canal</FormLabel>
              <Input placeholder="Digite o nome do canal" {...field} required />
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Join
        </Button>
      </form>
    </Form>
  );
}
