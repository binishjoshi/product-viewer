import mongoose from 'mongoose';
import supertest from 'supertest';

import createServer from '../utils/server';
import * as UserService from '../service/user.service';
import * as SessionService from '../service/session.service';
import { createUserSessionHandler } from '../controller/session.controller';

const userId = new mongoose.Types.ObjectId().toString();
const sessionId = new mongoose.Types.ObjectId().toString();

const app = createServer();

const userPayload = {
  _id: userId,
  email: 'jane.doe@example.com',
  name: 'Jane Doe',
};

const userInput = {
  email: 'test@pm.me',
  password: 'test123',
  passwordConfirmation: 'test123',
  name: 'Test Doe',
};

const sessionPayload = {
  _id: sessionId,
  user: userId,
  valid: true,
  userAgent: 'PostmanRuntime/7.29.2',
  createdAt: new Date('2022-11-20T09:10:21.153Z'),
  updatedAt: new Date('2022-11-20T09:10:21.153Z'),
  __v: 0,
};

describe('user', () => {
  describe('user registration', () => {
    describe('if username and password are valid i.e. testing validators', () => {
      it('should return user payload', async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, 'createUser')
          // @ts-ignore
          .mockReturnValueOnce(userPayload);

        const { statusCode, body } = await supertest(app)
          .post('/api/users')
          .send(userInput);

        expect(statusCode).toBe(200);
        expect(body).toEqual(userPayload);
        expect(createUserServiceMock).toHaveBeenCalledWith(userInput);
      });
    });

    describe('if passwords do not match', () => {
      it('should return 400', async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, 'createUser')
          //@ts-ignore
          .mockRejectedValueOnce(userPayload);

        const { statusCode, body } = await supertest(app)
          .post('/api/users')
          .send({ ...userInput, passwordConfirmation: 'doesnotmatch' });

        expect(statusCode).toBe(400);
        expect(createUserServiceMock).not.toHaveBeenCalled();
      });
    });

    describe('if user service throws', () => {
      it('should return 409', async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, 'createUser')
          .mockRejectedValue('oh nuu');

        const { statusCode } = await supertest(app)
          .post('/api/users')
          .send(userInput);

        expect(statusCode).toBe(409);

        expect(createUserServiceMock).toHaveBeenCalled();
      });
    });
  });
  describe('create user session', () => {
    describe('if username and password are valid', () => {
      it('should a return a signed accessToken and refreshToken', async () => {
        jest
          .spyOn(UserService, 'validatePassword')
          //@ts-ignore
          .mockReturnValue(userPayload);

        jest
          .spyOn(SessionService, 'createSession')
          //@ts-ignore
          .mockReturnValue(sessionPayload);

        const req = {
          body: {
            email: 'test@pm.me',
            password: 'test123',
          },
          get: () => {
            return 'a user agent';
          },
        };

        const send = jest.fn();

        const res = {
          send,
        };

        //@ts-ignore
        await createUserSessionHandler(req, res);

        expect(send).toHaveBeenCalledWith({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        });
      });
    });
  });
});
