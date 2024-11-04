import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Message } from './entity/message';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  async sendMessage(
    createMessageDto: CreateMessageDto,
    entityManager: EntityManager,
  ) {
    const message = entityManager.create(Message, createMessageDto);
    await entityManager.save(Message, message);
    return message;
  }

  async getAllMessages(): Promise<Message[]> {
    return this.messagesRepository.find();
  }

  async getMessagesByChannel(channel: string): Promise<Message[]> {
    return this.messagesRepository.find({ where: { channel } });
  }
}
