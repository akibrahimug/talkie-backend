import { Request, Response } from 'express';
import * as cloudinaryUploads from '@global/helpers/cloudinary-upload';
import {
  authMock,
  authMockRequest,
  authMockResponse,
} from '@root/mocks/auth.mock';
import { Signup } from '../signup';
import { CustomError } from '@global/helpers/error-handler';
import { authService } from '@service/db/auth.service';
import { UserCache } from '@service/redis/user.cache';

// We are not  testing actual data but rather mocked data
jest.useFakeTimers();
jest.mock('@service/queues/base.queue');
jest.mock('@service/redis/user.cache');
jest.mock('@service/queues/user.queue');
jest.mock('@service/queues/auth.queue');
jest.mock('@global/helpers/cloudinary-upload');

describe('SignUp', () => {
  // clear the mocks before and after the tests run
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });
  // USERNAME
  it('should throw an error if username is not available', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: '',
        email: 'manny@test.com',
        password: 'qwerty',
        avatarColor: 'red',
        avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==',
      }
    ) as Request;
    const res: Response = authMockResponse();
    Signup.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual(
        'Username is a required field'
      );
    });
  });

  it('should throw an error if username length is less than minimum length', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'ak',
        email: 'manny@test.com',
        password: 'qwerty',
        avatarColor: 'red',
        avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==',
      }
    ) as Request;
    const res: Response = authMockResponse();
    Signup.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Invalid username');
    });
  });

  it('should throw an error if username length is less than maximum length', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'akdskjghrgiuqhriuhqrqbkqonire',
        email: 'manny@test.com',
        password: 'qwerty',
        avatarColor: 'red',
        avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==',
      }
    ) as Request;
    const res: Response = authMockResponse();
    Signup.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Invalid username');
    });
  });

  // PASSWORD
  it('should throw an error if password is not available', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'akibra',
        email: 'manny@test.com',
        password: '',
        avatarColor: 'red',
        avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==',
      }
    ) as Request;
    const res: Response = authMockResponse();
    Signup.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual(
        'Password is a required field'
      );
    });
  });

  it('should throw an error if password length is less than minimum length', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'akibra',
        email: 'manny@test.com',
        password: 'h',
        avatarColor: 'red',
        avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==',
      }
    ) as Request;
    const res: Response = authMockResponse();
    Signup.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Invalid password');
    });
  });

  it('should throw an error if password length is less than maximum length', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'akibra',
        email: 'manny@test.com',
        password: 'erougihqeriguqhrlghrqigu3riu13g4fuiqwehfj34f',
        avatarColor: 'red',
        avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==',
      }
    ) as Request;
    const res: Response = authMockResponse();
    Signup.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Invalid password');
    });
  });

  // EMAIL
  it('should throw an error if email is not available', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'akibra',
        email: '',
        password: 'qwerty',
        avatarColor: 'red',
        avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==',
      }
    ) as Request;
    const res: Response = authMockResponse();
    Signup.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual(
        'Email is a required field'
      );
    });
  });

  it('should throw an error if email is not a valid email format', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'akibra',
        email: 'manny@',
        password: 'qwerty',
        avatarColor: 'red',
        avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==',
      }
    ) as Request;
    const res: Response = authMockResponse();
    Signup.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Email must be valid');
    });
  });

  // IF THE USER ALREADY EXISTS
  it('should throw unauthorized error if the user already exists', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'akibra',
        email: 'manny@test.com',
        password: 'qwerty',
        avatarColor: 'red',
        avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==',
      }
    ) as Request;
    const res: Response = authMockResponse();
    jest
      .spyOn(authService, 'getUserByUsernameOrEmail')
      .mockResolvedValue(authMock);
    Signup.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Invalid credentials');
    });
  });

  // WHEN EVERYTHING IS FINE WHAT DOES THE SIGNUP RETURN ==> THE ACTUAL RESPONSE
  it('should set session data for valid credentials and send correct json response', async () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'akibra',
        email: 'manny@test.com',
        password: 'qwerty',
        avatarColor: 'red',
        avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==',
      }
    ) as Request;
    const res: Response = authMockResponse();
    const userSpy = jest.spyOn(UserCache.prototype, 'saveUserToCahce');
    jest
      .spyOn(cloudinaryUploads, 'uploads')
      .mockImplementation((): any =>
        Promise.resolve({ version: '123456789', public_id: '09898987776' })
      );
    jest
      .spyOn(authService, 'getUserByUsernameOrEmail')
      .mockResolvedValue(null as any);
    await Signup.prototype.create(req, res);

    expect(req.session?.jwt).toBeDefined();
    expect(res.json).toHaveBeenCalledWith({
      message: 'User created successfully',
      user: userSpy.mock.calls[0][2],
      token: req.session?.jwt,
    });
  });
});
