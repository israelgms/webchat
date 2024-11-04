import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesModule } from './messages/module';
import { MessagesController } from './messages/controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'admin',
      password: '123456789',
      database: 'chatweb',
      autoLoadEntities: true,
      synchronize: true,
    }),
    MessagesModule,
  ],
  controllers: [MessagesController],
})
export class AppModule {}
