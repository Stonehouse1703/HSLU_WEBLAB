import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { AppModule } from '../src/app.module.js';

describe('Backend API Integration Tests (In-Memory MongoDB & Supertest)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;

  let userOneToken: string;
  let userOneId: string;
  let userTwoToken: string;
  let userTwoId: string;
  let createdTourId: string;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongod.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  }, 30000);

  afterAll(async () => {
    await app?.close();
    await mongoose.disconnect();
    await mongod?.stop();
    delete process.env.MONGO_URI;
  });

  describe('Auth API (/api/auth)', () => {
    it('POST /api/auth/register - should register a new user in database and return JWT token', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          firstName: 'Colin',
          lastName: 'Muster',
          email: 'colin.integration@test.ch',
          password: 'securepassword123',
          birthday: '2000-01-01',
          phoneNumber: '+41 79 123 45 67',
        })
        .expect(201);

      expect(response.body.token).toBeDefined();
      expect(response.body.user).toMatchObject({
        firstName: 'Colin',
        lastName: 'Muster',
        email: 'colin.integration@test.ch',
      });

      userOneToken = response.body.token;
      userOneId = response.body.user.id;
    });

    it('POST /api/auth/login - should authenticate registered user with credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'colin.integration@test.ch',
          password: 'securepassword123',
        })
        .expect(201);

      expect(response.body.token).toBeDefined();
      expect(response.body.user.id).toBe(userOneId);
    });

    it('GET /api/auth/me - should return authenticated user profile via Bearer token', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${userOneToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: userOneId,
        email: 'colin.integration@test.ch',
        firstName: 'Colin',
        lastName: 'Muster',
      });
    });
  });

  describe('Tours API (/api/tours)', () => {
    beforeAll(async () => {
      // Zweite Testperson für Tourenbeitritt registrieren
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          firstName: 'Anna',
          lastName: 'Teilnehmerin',
          email: 'anna.integration@test.ch',
          password: 'securepassword123',
        })
        .expect(201);

      userTwoToken = response.body.token;
      userTwoId = response.body.user.id;
    });

    it('POST /api/tours - should create a tour in database with creator as manager', async () => {
      const tourPayload = {
        name: 'Pazolastock Integration Tour',
        date: '2099-12-31',
        time: '08:00',
        location: 'Oberalppass',
        difficulty: 'mittel',
        altitude: '1100m',
        distance: '14 km',
        cost: 20,
        travelRoute: 'ÖV',
        requirements: 'B',
      };

      const response = await request(app.getHttpServer())
        .post('/api/tours')
        .set('Authorization', `Bearer ${userOneToken}`)
        .send(tourPayload)
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.name).toBe('Pazolastock Integration Tour');
      expect(response.body.tourManagerIds).toContain(userOneId);
      expect(response.body.participantIds).toEqual([]);

      createdTourId = response.body.id;
    });

    it('GET /api/tours/my-tours - should retrieve created tour from in-memory database', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/tours/my-tours')
        .set('Authorization', `Bearer ${userOneToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      const found = response.body.find((t: any) => t.id === createdTourId);
      expect(found).toBeDefined();
      expect(found.name).toBe('Pazolastock Integration Tour');
    });

    it('POST /api/tours/:id/join - should allow second user to join tour as participant', async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/tours/${createdTourId}/join`)
        .set('Authorization', `Bearer ${userTwoToken}`)
        .expect(201);

      expect(response.body.id).toBe(createdTourId);
      expect(response.body.participantIds).toContain(userTwoId);
    });
  });

  describe('Security & Role Permissions (/api/tours roles & emergency contacts)', () => {
    it('GET /emergency-contact - should forbid non-managers (403) from accessing emergency contact', async () => {
      await request(app.getHttpServer())
        .get(`/api/tours/${createdTourId}/users/${userOneId}/emergency-contact`)
        .set('Authorization', `Bearer ${userTwoToken}`)
        .expect(403);
    });

    it('GET /emergency-contact - should allow tour managers (200) to view participant emergency contact', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/tours/${createdTourId}/users/${userTwoId}/emergency-contact`)
        .set('Authorization', `Bearer ${userOneToken}`)
        .expect(200);

      expect(response.body.id).toBe(userTwoId);
      expect(response.body.emergencyContact).toBeDefined();
    });

    it('PATCH /role - should forbid non-managers (403) from altering roles', async () => {
      await request(app.getHttpServer())
        .patch(`/api/tours/${createdTourId}/users/${userTwoId}/role`)
        .set('Authorization', `Bearer ${userTwoToken}`)
        .send({ role: 'admin' })
        .expect(403);
    });

    it('PATCH /role - should allow tour manager (200) to promote participant to admin/manager', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/tours/${createdTourId}/users/${userTwoId}/role`)
        .set('Authorization', `Bearer ${userOneToken}`)
        .send({ role: 'admin' })
        .expect(200);

      expect(response.body.tourManagerIds).toContain(userTwoId);
    });

    it('POST /api/tours - should reject creating tours with past dates (400 Bad Request)', async () => {
      await request(app.getHttpServer())
        .post('/api/tours')
        .set('Authorization', `Bearer ${userOneToken}`)
        .send({
          name: 'Vergangene Tour',
          date: '2020-01-01',
          time: '08:00',
          location: 'Rigi',
          difficulty: 'leicht',
          altitude: '500m',
        })
        .expect(400);
    });
  });
});

