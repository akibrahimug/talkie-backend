import { IUserDocument } from '@user/interfaces/user.interfaces';
import { BaseCache } from './base.cache';
import Logger from 'bunyan';
import { config } from '@root/config';
import { ServerError } from '@global/helpers/error-handler';

const log: Logger = config.createLogger('userCahce');

export class UserCache extends BaseCache {
  constructor() {
    super('userCache');
  }

  // save usercahce as a set(HSET) ==> because this is used as an obj
  public async saveUserToCahce(
    key: string,
    userUId: string,
    createdUser: IUserDocument
  ): Promise<void> {
    // using the redis zadd --> adds all the sets as sorted --> HELPS TO ALSO RETRIVE ALL PROPERTIES
    const createdAt = new Date();
    const {
      _id,
      uId,
      username,
      email,
      avatarColor,
      blocked,
      blockedBy,
      postsCount,
      profilePicture,
      followersCount,
      followingCount,
      notifications,
      work,
      location,
      school,
      quote,
      bgImageId,
      bgImageVersion,
      social,
    } = createdUser;
    const firstList: string[] = [
      '_id',
      `${_id}`,
      'uId',
      `${uId}`,
      'username',
      `${username}`,
      'email',
      `${email}`,
      'avatarColor',
      `${avatarColor}`,
      'createdAt',
      `${createdAt}`,
      'postsCount',
      `${postsCount}`,
    ];
    const secondList: string[] = [
      'blocked',
      JSON.stringify(blocked),
      'blockedBy',
      JSON.stringify(blockedBy),
      'profilePicture',
      `${profilePicture}`,
      'followersCount',
      `${followersCount}`,
      'followingCount',
      `${followingCount}`,
      'notifications',
      JSON.stringify(notifications),
      'social',
      JSON.stringify(social),
    ];
    const thirdList: string[] = [
      'work',
      `${work}`,
      'location',
      `${location}`,
      'school',
      `${school}`,
      'quote',
      `${quote}`,
      'bgImageId',
      `${bgImageId}`,
      'bgImageVersion',
      `${bgImageVersion}`,
    ];

    const dataToSave: string[] = [...firstList, ...secondList, ...thirdList];

    try {
      //  create connection anytime we need to use them
      // if there is an open connection, dont open else create new connection
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      // creating a sorted set
      await this.client.ZADD('user', {
        score: parseInt(userUId, 10),
        value: `${key}`,
      });
      await this.client.HSET(`users:${key}`, dataToSave);
    } catch (error) {
      log.error(error);
      // global server error
      throw new ServerError('Server error, Try again');
    }
  }
}
