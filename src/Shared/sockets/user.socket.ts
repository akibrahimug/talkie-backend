import { ISocketData } from '@user/interfaces/user.interfaces';
import { Server, Socket } from 'socket.io';

export let socketIOUserObject: Server;

export class SocketIoUserHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    socketIOUserObject = io;
  }

  public listen(): void {
    this.io.on('connection', (socket: Socket) => {
      // used to unfollow
      socket.on('block user', (data: ISocketData) => {
        this.io.emit('blocked user id', data);
      });

      socket.on('unblock user', (data: ISocketData) => {
        this.io.emit('unblocked user id', data);
      });
    });
  }
}
