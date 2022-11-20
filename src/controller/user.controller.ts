import logger from '../utils/logger';
import { omit } from 'lodash';
import { createUser } from '../service/user.service';

import { Request, Response } from 'express';
import { CreateUserInput } from '../schema/user.schema';

export async function createUserHandler(req: Request<{}, {}, CreateUserInput["body"]>, res: Response) {
  try {
    const user = await createUser(req.body);
    return res.send(omit(user.toJSON(), "password"));
  } catch(error: any) {
    logger.error(error);
    return res.status(409).send(error.message);
  }
}
