import { RequestHandler } from 'express';
import { get } from 'lodash';
import { reIssueAccessToken } from '../service/session.service';
import { verifyJwt } from '../utils/jwt.utils';

const deserializeUser: RequestHandler = async (req, res, next) => {
  const accessToken =
    get(req, 'cookies.accessToken') ||
    get(req, 'headers.authorization', '').replace(/^Bearer\s/, '');

  const refreshToken =
    get(req, 'accokies.refreshToken') || <string>get(req, 'headers.x-refresh');

  if (!accessToken) {
    return next();
  }

  const { expired, decoded } = verifyJwt(accessToken);

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });

    if (newAccessToken) {
      res.setHeader('x-access-token', newAccessToken);
      res.cookie('accessToken', newAccessToken, {
        maxAge: 3.154e10, // 1year
        httpOnly: true,
        domain: 'localhost',
        path: '/',
        sameSite: 'strict',
        // HTTPS
        secure: false,
      });

      const result = verifyJwt(newAccessToken);

      res.locals.user = result.decoded;
      return next();
    }
  }

  return next();
};

export default deserializeUser;
