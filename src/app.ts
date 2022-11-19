import express from 'express';
import config from 'config'

import routes from './routes';

import connect from './utils/connect';
import logger from './utils/logger';

const port = config.get<number>('port');

const app = express();

app.listen(port, async () => {
  logger.info(`App running on port http://127.0.0.1:${port}`);

  await connect();

  routes(app);
});
