import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from '../redis/service';
import { Message } from './entity/message';
import { MessagesService } from './service';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@WebSocketGateway()
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private readonly redisService: RedisService,
    private readonly messagesService: MessagesService,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    this.redisService.registerMessageHandler(
      this.handleRedisMessage.bind(this),
    );
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join')
  async handleJoinChannel(
    client: Socket,
    payload: { username: string; channel: string },
  ) {
    client.join(payload.channel);
    await this.redisService.subscribeToChannel(payload.channel);
  }

  @SubscribeMessage('leave')
  async handleLeaveChannel(client: Socket, channel: string) {
    client.leave(channel);
    await this.redisService.unsubscribeFromChannel(channel);
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: Message) {
    await this.entityManager.transaction(async (entityManager) => {
      await this.messagesService.sendMessage(payload, entityManager);
      await this.redisService.publishMessage(payload);
    });
  }

  public handleRedisMessage(channel: string, message: string) {
    const parsedMessage = JSON.parse(message);

    this.server.to(channel).emit(`message:${channel}`, parsedMessage);
  }
}
