import supertest from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import createServer from '../utils/server';

const app = createServer();

describe('product', () => {
  beforeAll(async () => {
    const mongoserver = await MongoMemoryServer.create();

    await mongoose.connect(mongoserver.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  })

  describe('get product route', () => {
    describe('if the product does not exist', () => {
      it('should return 404', async () => {
        const productId = 'product-123';
        await supertest(app).get(`/api/products/${productId}`).expect(404);
      });
    });
  });
});
