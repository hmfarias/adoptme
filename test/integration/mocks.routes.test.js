import app from '../../src/app.js';
import mongoose from 'mongoose';
import request from 'supertest';
import { expect } from 'chai';
import { connectDB } from '../../src/config/database.config.js';
import { config } from '../../src/config/config.js';
import UserModel from '../../src/dao/models/user.model.js';
import PetModel from '../../src/dao/models/pet.model.js';

describe('Mocks Routes - Integration Test', () => {
	before(async () => {
		await connectDB(config.DB_NAME_TEST);
	});

	beforeEach(async () => {
		await UserModel.deleteMany();
		await PetModel.deleteMany();
	});

	after(async () => {
		await mongoose.connection.close();
	});

	describe('GET /api/mocks/mockingusers', () => {
		it('should return mock users with default quantity', async () => {
			const response = await request(app).get('/api/mocks/mockingusers');
			expect(response.status).to.equal(200);
			expect(response.body.error).to.be.false;
			expect(response.body.payload).to.be.an('array');
			expect(response.body.payload.length).to.equal(50);
		});

		it('should return mock users with specified quantity', async () => {
			const response = await request(app)
				.get('/api/mocks/mockingusers')
				.query({ quantity: 10 });
			expect(response.status).to.equal(200);
			expect(response.body.payload.length).to.equal(10);
		});

		it('should return 400 for invalid quantity', async () => {
			const response = await request(app)
				.get('/api/mocks/mockingusers')
				.query({ quantity: -5 });
			expect(response.status).to.equal(400);
			expect(response.body.error).to.be.true;
		});
	});

	describe('GET /api/mocks/mockingpets', () => {
		it('should return mock pets with default quantity', async () => {
			const response = await request(app).get('/api/mocks/mockingpets');
			expect(response.status).to.equal(200);
			expect(response.body.error).to.be.false;
			expect(response.body.payload).to.be.an('array');
			expect(response.body.payload.length).to.equal(50);
		});

		it('should return mock pets with specified quantity', async () => {
			const response = await request(app)
				.get('/api/mocks/mockingpets')
				.query({ quantity: 5 });
			expect(response.status).to.equal(200);
			expect(response.body.payload.length).to.equal(5);
		});

		it('should return 400 for invalid quantity', async () => {
			const response = await request(app)
				.get('/api/mocks/mockingpets')
				.query({ quantity: -1 });
			expect(response.status).to.equal(400);
			expect(response.body.error).to.be.true;
		});
	});

	describe('POST /api/mocks/generateData', () => {
		it('should insert mock users and pets into the database', async () => {
			const response = await request(app)
				.post('/api/mocks/generateData')
				.send({ users: 3, pets: 2 });

			expect(response.status).to.equal(200);
			expect(response.body.error).to.be.false;
			expect(response.body.payload.insertedUsers.length).to.equal(3);
			expect(response.body.payload.insertedPets.length).to.equal(2);

			const usersInDb = await UserModel.find();
			const petsInDb = await PetModel.find();
			expect(usersInDb.length).to.equal(3);
			expect(petsInDb.length).to.equal(2);
		});

		it('should insert nothing if users and pets are zero', async () => {
			const response = await request(app)
				.post('/api/mocks/generateData')
				.send({ users: 0, pets: 0 });

			expect(response.status).to.equal(200);
			expect(response.body.payload.insertedUsers.length).to.equal(0);
			expect(response.body.payload.insertedPets.length).to.equal(0);
		});
	});
});
