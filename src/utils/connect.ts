import mongoose from 'mongoose';
import config from 'config';
import logger from './logger';

async function connect() {
  const dbUri = config.get<string>('dbUri');

  try {
    logger.info('Initiating connection with the database...');
    await mongoose.connect(dbUri);
    logger.info('Connected to DB');
  } catch (error) {
    logger.error('Could not connect');
    process.exit(1);
  }
}

export default connect;
