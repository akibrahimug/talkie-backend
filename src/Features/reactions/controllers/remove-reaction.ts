import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { IReactionJob } from '@reaction/interfaces/reaction.interface';
import { ReactionsCache } from '@service/redis/reaction.cache';
import { reactionsQueue } from '@service/queues/reactions.queue';

const reactionCache: ReactionsCache = new ReactionsCache();

export class Remove {
  public async reaction(req: Request, res: Response): Promise<void> {
    try {
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
      res
        .status(HTTP_STATUS.OK)
        .json({ message: 'Reaction removed from post' });
    } catch (error) {
      console.error('Error removing reaction (URL params method):', error);
      res.status(HTTP_STATUS.SERVICE_UNAVAILABLE).json({
        message: 'Error removing reaction',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  public async reactionWithBody(req: Request, res: Response): Promise<void> {
    try {
      const { postId, previousReaction } = req.params;
      const { postReactions } = req.body;

      if (!postReactions) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: 'postReactions is required in the request body',
        });
        return;
      }

      await reactionCache.removePostReactionFromCache(
        postId,
        `${req.currentUser!.username}`,
        postReactions
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

      res
        .status(HTTP_STATUS.OK)
        .json({ message: 'Reaction removed from post' });
    } catch (error) {
      console.error('Error removing reaction (body method):', error);
      res.status(HTTP_STATUS.SERVICE_UNAVAILABLE).json({
        message: 'Error removing reaction',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
