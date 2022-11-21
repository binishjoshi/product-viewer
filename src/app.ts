import config from 'config';
import connect from './utils/connect';
import logger from './utils/logger';

import createServer from './utils/server';

const port = config.get<number>('port');

const app = createServer();

app.listen(port, async () => {
  logger.info(`App running on port http://127.0.0.1:${port}`);

  await connect();
});
