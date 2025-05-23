import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { Server } from 'http';
import { PrismaService } from 'src/prisma/prisma.service';
import * as request from 'supertest';

describe('Unsubscribe (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  const email = 'unsubscribe@example.com';
  const city = 'Kyiv';
  const frequency = 'daily';

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.setGlobalPrefix('api');
    await app.init();

    prisma = app.get(PrismaService);
    await prisma.token.deleteMany();
    await prisma.subscription.deleteMany();

    await request(app.getHttpServer() as unknown as Server)
      .post('/api/subscribe')
      .send({ email, city, frequency });

    const sub = await prisma.subscription.findFirst({ where: { email } });
    if (!sub) throw new Error('Subscription not found');
    const dbToken = await prisma.token.findFirst({
      where: { subscriptionId: sub.id },
    });
    if (!dbToken) throw new Error('Token not found');
    token = dbToken.token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should unsubscribe with valid token', async () => {
    const res = await request(app.getHttpServer() as unknown as Server)
      .get(`/api/unsubscribe/${token}`)
      .expect(200);

    expect(res.body).toHaveProperty('message');
  });

  it('should return 400 for invalid token', async () => {
    await request(app.getHttpServer() as unknown as Server)
      .get('/api/unsubscribe/invalidtoken')
      .expect(400);
  });
});
