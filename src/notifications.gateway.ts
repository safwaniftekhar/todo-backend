import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*', 
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(NotificationsGateway.name);
  private users = new Map<string, string>(); 

  handleConnection(socket: Socket) {
    const userId = socket.handshake.query.userId as string;
    if (userId) {
      this.users.set(userId, socket.id);
      this.logger.log(`User ${userId} connected`);
    }
  }

  handleDisconnect(socket: Socket) {
    const userId = [...this.users.entries()].find(
      ([, sockId]) => sockId === socket.id,
    )?.[0];

    if (userId) {
      this.users.delete(userId);
      this.logger.log(`User ${userId} disconnected`);
    }
  }

  notifyUser(userId: string, message: any) {
    Logger.log(`${message}`)
    const socketId = this.users.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('notification', message);
    }
  }
}
