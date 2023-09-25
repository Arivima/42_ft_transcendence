import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChatGateway } from "../chat/chat.gateway";

@Controller('message')
export class MessageController {
  constructor(private readonly chatGateway: ChatGateway) {}

  @Post()
  sendMessage(@Body() message: { sender: string; message: string }) {
    console.log(message);
    this.chatGateway.handleMessage(null, message);
  }
}