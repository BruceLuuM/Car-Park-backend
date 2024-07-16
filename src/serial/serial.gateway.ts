import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SerialPort } from 'serialport';
import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
@WebSocketGateway()
export class SerialGateway implements OnGatewayInit {
  // Implement OnGatewayInit interface
  @WebSocketServer()
  server: Server;

  private serialPort: SerialPort;
  private serialDataStream$: Subject<string> = new Subject<string>();

  constructor() {
    this.initializeSerialPort();
  }

  async handleConnection(client: any, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
    // Send initial data if needed
  }

  async handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('startSerialListener')
  startSerialListener(client: any, data: any): Observable<string> {
    return this.serialDataStream$.asObservable();
  }

  afterInit(server: Server) {
    // Implement afterInit method
    // You can add initialization code here if needed
    console.log('WebSocket gateway initialized');
  }

  private initializeSerialPort() {
    try {
      this.serialPort = new SerialPort({
        path: 'COM5', // Replace with your Arduino's serial port
        baudRate: 9600,
        dataBits: 8,
        parity: 'none',
        stopBits: 1,
        autoOpen: true,
      });

      this.serialPort.on('data', (data: Buffer) => {
        const message = data.toString('utf8').trim();
        console.log('Received data from serial port:', message);
        // Define a regex pattern to match the HEX code
        const regex = /^Card UID: ([A-F0-9 ]+)$/;

        // Try to match the regex pattern with the message
        const match = regex.exec(message);

        if (match) {
          // Extract the HEX code part
          const hexCode = match[1].trim().replace(/\s/g, ''); // Remove spaces from the HEX code
          console.log('Extracted HEX code:', hexCode);
          this.server.emit('cardID', hexCode);
        }
        this.serialDataStream$.next(message); // Broadcast data to WebSocket clients
      });

      this.serialPort.on('error', (err) => {
        console.error('Error on serial port:', err.message);
      });

      this.serialPort.on('close', () => {
        console.log('Serial port closed');
      });

      console.log('Serial port initialized successfully');
    } catch (error) {
      console.error('Failed to initialize serial port:', error.message);
    }
  }
  @OnEvent('openServo')
  handleOpenServo() {
    this.serialPort.write('1\n', (err) => {
      if (err) {
        console.log('Error on write: ', err.message);
        return 'Error opening servo';
      }
      console.log('Open servo command sent');
    });
  }

  @SubscribeMessage('cardID')
  handleChatUpdate(@MessageBody() data: any) {
    this.server.emit('cardID', data); // Broadcast to all clients in the channel
    // this.server.emit('chat_update', data); // Broadcast to all clients in the channel
    console.log(`Message received on cardID: ${data}`);
  }
}
