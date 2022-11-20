import { RequestHandler } from 'express';
import { get } from 'lodash';
import { verifyJwt } from '../utils/jwt.utils';

const deserializeUser: RequestHandler = (req, res, next) => {
  const accessToken = get(req, 'headers.authorization', '').replace(
    /^Bearer\s/,
    ''
  );

  if (!accessToken) {
    return next();
  }

  const { expired, decoded } = verifyJwt(accessToken);

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  return next();
};

export default deserializeUser;
