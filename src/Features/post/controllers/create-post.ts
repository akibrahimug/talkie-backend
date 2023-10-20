import { joiValidation } from '@global/decorators/joi-validation.decorator';
import { uploads } from '@global/helpers/cloudinary-upload';
import { BadRequestError } from '@global/helpers/error-handler';
import { IPostDocument } from '@post/interfaces/post.interface';
import { postSchema, postWithImageSchema } from '@post/schemes/post.schemes';
import { imageQueue } from '@service/queues/image.queue';
import { postQueue } from '@service/queues/post.queue';
import { PostCache } from '@service/redis/post.cache';
import { socketIOPostObject } from '@socket/post.socket';
import { UploadApiResponse } from 'cloudinary';
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

  // *******************************************************
  // POST WITH IMAGE
  // *******************************************************
  @joiValidation(postWithImageSchema)
  public async postWithImage(req: Request, res: Response): Promise<void> {
    const { post, bgColor, privacy, gifUrl, profilePicture, feelings, image } =
      req.body;

    const result: UploadApiResponse = (await uploads(
      image
    )) as UploadApiResponse;
    if (!result?.public_id) {
      throw new BadRequestError(result.message);
    }
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
      imgId: result.public_id,
      imgVersion: result.version.toString(),
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

    // call image queue to add image to mongodb
    imageQueue.addImageJob('addImageToDB', {
      key: `${req.currentUser!.userId}`,
      imgId: result.public_id,
      imgVersion: result.version.toString(),
    });

    res
      .status(HTTP_SERVER.CREATED)
      .json({ message: 'Post created with image successfully' });
  }
}
