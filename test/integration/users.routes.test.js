import app from '../../src/app.js';
import mongoose from 'mongoose';
import request from 'supertest';
import { expect } from 'chai';
import UserModel from '../../src/dao/models/user.model.js';
import { connectDB } from '../../src/config/database.config.js';
import { config } from '../../src/config/config.js';

describe('Users Routes - Integration Test', () => {
	let createdUser;

	const mockUser = {
		first_name: 'John',
		last_name: 'Doe',
		email: 'john.doe@example.com',
		password: '123',
	};

	before(async () => {
		await connectDB(config.DB_NAME); // Usa tu DB de test
	});

	beforeEach(async () => {
		await UserModel.deleteMany();
	});

	after(async () => {
		await mongoose.connection.close();
	});

	it('GET /api/users - getAllUsers -> should return 404 when no users', async () => {
		const response = await request(app).get('/api/users');
		expect(response.status).to.equal(404);
		expect(response.body).to.have.property('error', true);
	});

	it('GET /api/users - getAllUsers -> should return users after insertions', async () => {
		await UserModel.create(mockUser);

		const response = await request(app).get('/api/users');
		expect(response.status).to.equal(200);
		expect(response.body.error).to.be.false;
		expect(response.body.payload).to.be.an('array').with.lengthOf(1);
		expect(response.body.payload[0].email).to.equal(mockUser.email);
	});

	it('GET /api/users/:uid - getUser -> should return a user by ID', async () => {
		const user = await UserModel.create(mockUser);

		const response = await request(app).get(`/api/users/${user._id}`);
		expect(response.status).to.equal(200);
		expect(response.body.payload.email).to.equal(mockUser.email);
	});

	it('PUT /api/users/:uid - updateUser -> should update a user', async () => {
		const user = await UserModel.create(mockUser);

		const response = await request(app)
			.put(`/api/users/${user._id}`)
			.send({ first_name: 'UpdatedName' });

		expect(response.status).to.equal(200);
		expect(response.body.payload.first_name).to.equal('UpdatedName');
	});

	it('DELETE /api/users/:uid - deleteUser -> should delete a user', async () => {
		const user = await UserModel.create(mockUser);

		const response = await request(app).delete(`/api/users/${user._id}`);
		expect(response.status).to.equal(200);
		expect(response.body.error).to.be.false;

		const findResponse = await request(app).get(`/api/users/${user._id}`);
		expect(findResponse.status).to.equal(404);
	});

	it('PUT /api/users/:uid - updateUser -> should return 404 if user not found', async () => {
		const fakeId = new mongoose.Types.ObjectId();
		const response = await request(app)
			.put(`/api/users/${fakeId}`)
			.send({ first_name: 'NoOne' });

		expect(response.status).to.equal(404);
	});

	it('DELETE /api/users/:uid - deleteUser -> should return 404 if user not found', async () => {
		const fakeId = new mongoose.Types.ObjectId();
		const response = await request(app).delete(`/api/users/${fakeId}`);
		expect(response.status).to.equal(404);
	});

	it('GET /api/users/:uid - getUser -> should return 500 for invalid ID format', async () => {
		const response = await request(app).get('/api/users/invalid-id');
		expect(response.status).to.equal(500);
	});

	it('PUT /api/users/:uid - updateUser -> should fail with empty body', async () => {
		const user = await UserModel.create(mockUser);
		const response = await request(app).put(`/api/users/${user._id}`).send({});
		expect(response.status).to.equal(400);
	});

	it('DELETE /api/users/:uid  - deleteUser -> should return 404 on second delete attempt', async () => {
		const user = await UserModel.create(mockUser);
		await request(app).delete(`/api/users/${user._id}`);
		const secondDelete = await request(app).delete(`/api/users/${user._id}`);
		expect(secondDelete.status).to.equal(404);
	});

	it('PUT /api/users/:uid - updateUser -> should hash password on update and remove it from response', async () => {
		const user = await UserModel.create(mockUser);
		const response = await request(app)
			.put(`/api/users/${user._id}`)
			.send({ password: 'NewPassword123' });

		expect(response.status).to.equal(200);
		expect(response.body.payload).to.not.have.property('password');
	});
});
