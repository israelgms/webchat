import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { MessagesService } from './service';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  @Post()
  async sendMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.sendMessage(
      createMessageDto,
      this.entityManager,
    );
  }

  @Get()
  async getAllMessages() {
    return this.messagesService.getAllMessages();
  }

  @Get(':channel')
  async getMessages(@Param('channel') channel: string) {
    return this.messagesService.getMessagesByChannel(channel);
  }
}
