import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { IReactionJob } from '@reaction/interfaces/reaction.interface';
import { ReactionsCache } from '@service/redis/reaction.cache';
import { reactionsQueue } from '@service/queues/reactions.queue';

const reactionCache: ReactionsCache = new ReactionsCache();

export class Remove {
  public async reaction(req: Request, res: Response): Promise<void> {
    const { postId, previousReaction, postReactions } = req.params;
    await reactionCache.removePostReactionFromCache(
      postId,
      `${req.currentUser!.username}`,
      JSON.parse(postReactions)
    );
    const databaseReactionData: IReactionJob = {
      postId,
      username: req.currentUser!.username,
      previousReaction,
    };
    reactionsQueue.addReactionsJob(
      'removeReactionFromDB',
      databaseReactionData
    );
    res.status(HTTP_STATUS.OK).json({ message: 'Reaction removed from post' });
  }
}
