import { joiValidation } from '@global/decorators/joi-validation.decorator';
import { IPostDocument } from '@post/interfaces/post.interface';
import { postSchema } from '@post/schemes/post.schemes';
import { postQueue } from '@service/queues/post.queue';
import { PostCache } from '@service/redis/post.cache';
import { socketIOPostObject } from '@socket/post.sockets';
import { Request, Response } from 'express';
import HTTP_SERVER from 'http-status-codes';
import { ObjectId } from 'mongodb';

const postCache: PostCache = new PostCache();

export class Create {
  @joiValidation(postSchema)
  public async post(req: Request, res: Response): Promise<void> {
    const { post, bgColor, privacy, gifUrl, profilePicture, feelings } =
      req.body;

    const postObjectId: ObjectId = new ObjectId();
    const createdPost: IPostDocument = {
      _id: postObjectId,
      userId: req.currentUser!.userId,
      username: req.currentUser!.username,
      email: req.currentUser!.email,
      avatarColor: req.currentUser!.avatarColor,
      profilePicture,
      post,
      bgColor,
      feelings,
      privacy,
      gifUrl,
      commentsCount: 0,
      imgId: '',
      imgVersion: '',
      createdAt: new Date(),
      reactions: {
        like: 0,
        love: 0,
        happy: 0,
        sad: 0,
        wow: 0,
        angry: 0,
      },
    } as IPostDocument;
    socketIOPostObject.emit('add post', createdPost);
    await postCache.savePostToCache({
      key: postObjectId,
      currentUserId: `${req.currentUser!.userId}`,
      uId: `${req.currentUser!.uId}`,
      createdPost,
    });
    postQueue.addPostJob('addPostToDB', {
      key: req.currentUser!.userId,
      value: createdPost,
    });

    res
      .status(HTTP_SERVER.CREATED)
      .json({ message: 'Post created successfully' });
  }
}
