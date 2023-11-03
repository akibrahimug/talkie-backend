import { BaseCache } from './base.cache';
import Logger from 'bunyan';
import { config } from '@root/config';
import { ServerError } from '@global/helpers/error-handler';
import { Helpers } from '@global/helpers/helpers';
import { IReactions } from '@post/interfaces/post.interface';
import { IReactionDocument } from '@reaction/interfaces/reaction.interface';
import { find } from 'lodash';
const log: Logger = config.createLogger('userCahce');

export class ReactionsCache extends BaseCache {
  constructor() {
    super('reactionsCache');
  }

  public async saveReactionToCache(
    key: string,
    reaction: IReactionDocument,
    postReaction: IReactions,
    type: string,
    previousReaction: string
  ): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      if (previousReaction) {
        // call remove reation method
        this.removePostReactionFromCache(key, reaction.username, postReaction);
      }

      if (type) {
        await this.client.LPUSH(`reactions:${key}`, JSON.stringify(reaction));
        await this.client.HSET(
          `posts:${key}`,
          'reactions',
          JSON.stringify(postReaction)
        );
      }
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error, Try again');
    }
  }

  public async removePostReactionFromCache(
    key: string,
    username: string,
    postReaction: IReactions
  ): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const response: string[] = await this.client.LRANGE(
        `reactions:${key}`,
        0,
        -1
      );
      const multi: ReturnType<typeof this.client.multi> = this.client.multi();
      const userPreviousreaction: IReactionDocument = this.getPreviousReaction(
        response,
        username
      ) as IReactionDocument;
      multi.LREM(`reactions:${key}`, 1, JSON.stringify(userPreviousreaction));
      await multi.exec();
      await this.client.HSET(
        `posts:${key}`,
        'reactions',
        JSON.stringify(postReaction)
      );
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error, Try again');
    }
  }

  public async getReactionsFromCache(
    postId: string
  ): Promise<[IReactionDocument[], number]> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const reactionsCount: number = await this.client.LLEN(
        `reactions:${postId}`
      );
      const response: string[] = await this.client.LRANGE(
        `reactions:${postId}`,
        0,
        -1
      );
      const list: IReactionDocument[] = [];
      for (const item of response) {
        list.push(Helpers.parseJson(item));
      }
      return response.length ? [list, reactionsCount] : [[], 0];
    } catch (e) {
      log.error(e);
      throw new ServerError('Server error, Try again');
    }
  }

  public async getSingleReactionByUsernameFromCache(
    postId: string,
    username: string
  ): Promise<[IReactionDocument, number] | []> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      const response: string[] = await this.client.LRANGE(
        `reactions:${postId}`,
        0,
        -1
      );
      const list: IReactionDocument[] = [];
      for (const item of response) {
        list.push(Helpers.parseJson(item));
      }
      const result: IReactionDocument = find(
        list,
        (listItem: IReactionDocument) => {
          return listItem?.postId === postId && listItem?.username === username;
        }
      ) as IReactionDocument;
      return result ? [result, 1] : [];
    } catch (e) {
      log.error(e);
      throw new ServerError('Server error, Try again');
    }
  }

  private getPreviousReaction(
    response: string[],
    username: string
  ): IReactionDocument | undefined {
    const list: IReactionDocument[] = [];
    for (const item of response) {
      list.push(Helpers.parseJson(item) as IReactionDocument);
    }
    return find(list, (listItem: IReactionDocument) => {
      return listItem.username === username;
    });
  }
}
