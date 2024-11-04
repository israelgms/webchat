import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesController } from './controller';
import { MessagesService } from './service';
import { Message } from './entity/message';
import { MessagesGateway } from './gateway';
import { RedisModule } from '../redis/module';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), RedisModule],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesGateway],
  exports: [MessagesService],
})
export class MessagesModule {}
