import mongoose from 'mongoose';
import config from 'config';

async function connect() {
  const dbUri = config.get<string>('dbUri');

  try {
    console.log('Initiating connection with the database...');
    await mongoose.connect(dbUri);
    console.log('Connected to DB');
  } catch (error) {
    console.log(error);
    console.log('Could not connect');
    process.exit(1);
  }
}

export default connect;
