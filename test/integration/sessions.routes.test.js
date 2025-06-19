import app from '../../src/app.js';
import mongoose from 'mongoose';
import request from 'supertest';
import { expect } from 'chai';
import { connectDB } from '../../src/config/database.config.js';
import { config } from '../../src/config/config.js';
import UserModel from '../../src/dao/models/user.model.js';

describe('Sessions Routes - Integration Test', () => {
	before(async () => {
		await connectDB(config.DB_NAME_TEST);
	});

	beforeEach(async () => {
		await UserModel.deleteMany();
	});

	after(async () => {
		await mongoose.connection.close();
	});

	const mockUser = {
		first_name: 'Test',
		last_name: 'User',
		email: 'testuser@example.com',
		password: 'Test1234',
	};

	it('POST /api/sessions/register -> should register a new user', async () => {
		const response = await request(app).post('/api/sessions/register').send(mockUser);
		expect(response.status).to.equal(200);
		expect(response.body.error).to.be.false;
		expect(response.body.payload).to.have.property('_id');
	});

	it('POST /api/sessions/register -> should fail if user already exists', async () => {
		await UserModel.create(mockUser); // Insert the user manually
		const response = await request(app).post('/api/sessions/register').send(mockUser);
		expect(response.status).to.equal(400);
		expect(response.body.error).to.be.true;
		expect(response.body.message).to.equal('User already exists');
	});

	it('POST /api/sessions/login -> should login and return cookie', async () => {
		await request(app).post('/api/sessions/register').send(mockUser);
		const response = await request(app).post('/api/sessions/login').send({
			email: mockUser.email,
			password: mockUser.password,
		});
		expect(response.status).to.equal(200);
		expect(response.body.error).to.be.false;
		expect(response.headers['set-cookie']).to.exist;
	});

	it('POST /api/sessions/login -> should fail with wrong password', async () => {
		await request(app).post('/api/sessions/register').send(mockUser);
		const response = await request(app).post('/api/sessions/login').send({
			email: mockUser.email,
			password: 'WrongPassword',
		});
		expect(response.status).to.equal(401);
		expect(response.body.error).to.be.true;
		expect(response.body.message).to.equal('Invalid credentials');
	});

	it('GET /api/sessions/current -> should return logged in user with valid cookie', async () => {
		await request(app).post('/api/sessions/register').send(mockUser);
		const loginRes = await request(app).post('/api/sessions/login').send({
			email: mockUser.email,
			password: mockUser.password,
		});

		const cookie = loginRes.headers['set-cookie'][0];
		const currentRes = await request(app)
			.get('/api/sessions/current')
			.set('Cookie', cookie);

		expect(currentRes.status).to.equal(200);
		expect(currentRes.body.error).to.be.false;
		expect(currentRes.body.payload).to.have.property('email', mockUser.email);
	});

	it('GET /api/sessions/current -> should fail without cookie', async () => {
		const response = await request(app).get('/api/sessions/current');
		expect(response.status).to.equal(401);
		expect(response.body.error).to.be.true;
		expect(response.body.message).to.equal('Authentication required');
	});

	it('POST /api/sessions/unprotectedLogin -> should login without DTO and return cookie', async () => {
		await request(app).post('/api/sessions/register').send(mockUser);
		const response = await request(app).post('/api/sessions/unprotectedLogin').send({
			email: mockUser.email,
			password: mockUser.password,
		});
		expect(response.status).to.equal(200);
		expect(response.body.error).to.be.false;
		expect(response.headers['set-cookie']).to.exist;
	});

	it('GET /api/sessions/unprotectedCurrent -> should return user with valid unprotected cookie', async () => {
		await request(app).post('/api/sessions/register').send(mockUser);
		const loginRes = await request(app).post('/api/sessions/unprotectedLogin').send({
			email: mockUser.email,
			password: mockUser.password,
		});

		const cookie = loginRes.headers['set-cookie'][0];
		const currentRes = await request(app)
			.get('/api/sessions/unprotectedCurrent')
			.set('Cookie', cookie);

		expect(currentRes.status).to.equal(200);
		expect(currentRes.body.error).to.be.false;
		expect(currentRes.body.payload).to.have.property('email', mockUser.email);
	});

	it('GET /api/sessions/unprotectedCurrent -> should fail without cookie', async () => {
		const response = await request(app).get('/api/sessions/unprotectedCurrent');
		expect(response.status).to.equal(401);
		expect(response.body.error).to.be.true;
	});
});
