import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import HTTP_STATUS from 'http-status-codes';
import { joiValidation } from '@global/decorators/joi-validation.decorator';
import { addReactionSchema } from '@reaction/schemes/reactions';
import {
  IReactionDocument,
  IReactionJob,
} from '@reaction/interfaces/reaction.interface';
import { ReactionsCache } from '@service/redis/reaction.cache';
import { reactionsQueue } from '@service/queues/reactions.queue';

const reactionCache: ReactionsCache = new ReactionsCache();

export class Add {
  @joiValidation(addReactionSchema)
  public async reaction(req: Request, res: Response): Promise<void> {
    const {
      userTo,
      postId,
      type,
      previousReaction,
      postReactions,
      profilePicture,
    } = req.body;
    const reactionObject: IReactionDocument = {
      _id: new ObjectId(),
      postId,
      type,
      avataColor: req.currentUser!.avatarColor,
      username: req.currentUser!.username,
      profilePicture,
    } as IReactionDocument;

    await reactionCache.saveReactionToCache(
      postId,
      reactionObject,
      postReactions,
      type,
      previousReaction
    );

    const databaseReactionData: IReactionJob = {
      postId,
      userTo,
      userFrom: req.currentUser!.userId,
      username: req.currentUser!.username,
      type,
      previousReaction,
      reactionObject,
    };
    reactionsQueue.addReactionsJob('addReactionToDB', databaseReactionData);
    res.status(HTTP_STATUS.OK).json({ message: 'Reaction added successfully' });
  }
}
