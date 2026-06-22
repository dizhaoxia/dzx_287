import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Notification } from '../../entities/notification.entity';

@WebSocketGateway({
  namespace: 'notification',
  cors: {
    origin: '*',
  },
})
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('NotificationGateway');

  private userSockets: Map<string, Set<string>> = new Map();

  afterInit(server: Server) {
    this.logger.log('Notification WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)!.add(client.id);
      this.logger.log(`User ${userId} connected with socket ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId && this.userSockets.has(userId)) {
      this.userSockets.get(userId)!.delete(client.id);
      if (this.userSockets.get(userId)!.size === 0) {
        this.userSockets.delete(userId);
      }
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  sendNotificationToUser(userId: string, notification: Notification): boolean {
    const socketIds = this.userSockets.get(userId);
    if (socketIds && socketIds.size > 0) {
      socketIds.forEach(socketId => {
        this.server.to(socketId).emit('notification', notification);
      });
      this.logger.log(`Notification sent to user ${userId}`);
      return true;
    }
    this.logger.log(`User ${userId} is not online, notification saved`);
    return false;
  }

  sendNotificationToAll(notification: Notification): void {
    this.server.emit('notification', notification);
    this.logger.log('Notification broadcasted to all connected users');
  }

  @SubscribeMessage('ping')
  handlePing(client: Socket, data: string) {
    return { event: 'pong', data: 'pong' };
  }

  @SubscribeMessage('markAllRead')
  handleMarkAllRead(client: Socket, userId: string) {
    this.logger.log(`User ${userId} marked all notifications as read`);
    return { success: true };
  }

  isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId) && this.userSockets.get(userId)!.size > 0;
  }

  getOnlineUsers(): string[] {
    return Array.from(this.userSockets.keys());
  }
}
