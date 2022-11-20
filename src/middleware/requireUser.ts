import { RequestHandler } from 'express';

const requireUser: RequestHandler = (_, res, next) => {
  const user = res.locals.user;

  if (!user) {
    return res.sendStatus(403);
  }

  return next();
};

export default requireUser;
