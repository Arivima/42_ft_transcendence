import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
 })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: any) {
    // Handle a new client connection
    console.log(`Client ${client.id} connected`);
  }

  handleDisconnect(client: any) {
    // Handle client disconnect
    console.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: { sender: string; message: string }) {
    this.server.emit('message', payload);
  }

  // Implement chat-related methods here, like sending/receiving messages
}