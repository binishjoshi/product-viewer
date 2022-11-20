import express from 'express';
import config from 'config';

import routes from './routes';
import connect from './utils/connect';
import logger from './utils/logger';

import deserializeUser from './middleware/deserializeUser';

const port = config.get<number>('port');

const app = express();

app.use(express.json());
app.use(deserializeUser);

app.listen(port, async () => {
  logger.info(`App running on port http://127.0.0.1:${port}`);

  await connect();

  routes(app);
});
