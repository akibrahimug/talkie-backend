import { ICommentDocument } from '@comment/interfaces/comments.interface';
import { IReactionDocument } from '@reaction/interfaces/reaction.interface';
import { Server, Socket } from 'socket.io';

export let socketIOPostObject: Server;
export class SocketIoPostHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    socketIOPostObject = io;
  }

  public listen(): void {
    this.io.on('connection', (socket: Socket) => {
      // reaction
      socket.on('reaction', (reaction: IReactionDocument) => {
        this.io.emit('Update like', reaction);
      });
      // comment
      socket.on('comment', (comment: ICommentDocument) => {
        this.io.emit('Update comment', comment);
      });
      console.log('Post socket handler');
    });
  }
}
