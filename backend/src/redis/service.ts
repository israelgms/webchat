import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly redisClientPub: Redis;
  private readonly redisClientSub: Redis;

  private messageHandler: (channel: string, message: string) => void;

  constructor() {
    this.redisClientPub = new Redis(6379, 'redis');
    this.redisClientSub = new Redis(6379, 'redis');
  }

  onModuleInit() {
    this.redisClientSub.on('message', (channel, message) => {
      if (this.messageHandler) {
        this.messageHandler(channel, message);
      }
    });
  }

  async publishMessage(message: any) {
    await this.redisClientPub.publish(
      message.channel,
      JSON.stringify(message),
    );
  }

  async subscribeToChannel(channel: string) {
    await this.redisClientSub.subscribe(channel);
  }

  async unsubscribeFromChannel(channel: string) {
    await this.redisClientSub.unsubscribe(channel);
  }

  registerMessageHandler(handler: (channel: string, message: string) => void) {
    this.messageHandler = handler;
  }

  onModuleDestroy() {
    this.redisClientPub.quit();
    this.redisClientSub.quit();
  }
}
