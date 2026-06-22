import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { NotificationGateway } from './notification.gateway';

@Module({
  controllers: [MessageController],
  providers: [MessageService, NotificationGateway],
  exports: [MessageService, NotificationGateway],
})
export class MessageModule {}
