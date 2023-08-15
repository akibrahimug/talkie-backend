import { reactionsWorker } from '@worker/reactions.worker';
import { BaseQueue } from './base.queue';
import { IReactionJob } from '@reaction/interfaces/reaction.interface';

class ReactionsQueue extends BaseQueue {
  constructor() {
    super('posts');
    // this processes jobs in a queue
    this.processJob('addReactionToDB', 5, reactionsWorker.addReactionToDB);
    this.processJob(
      'removeReactionFromDB',
      5,
      reactionsWorker.removeReactionFromDB
    );
  }

  public addReactionsJob(name: string, data: IReactionJob): void {
    this.addJob(name, data);
  }
}

export const reactionsQueue: ReactionsQueue = new ReactionsQueue();
