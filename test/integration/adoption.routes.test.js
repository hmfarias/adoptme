import app from '../../src/app.js';
import mongoose from 'mongoose';
import request from 'supertest';
import { expect } from 'chai';
import { connectDB } from '../../src/config/database.config.js';
import { config } from '../../src/config/config.js';
import UserModel from '../../src/dao/models/user.model.js';
import PetModel from '../../src/dao/models/pet.model.js';
import AdoptionModel from '../../src/dao/models/adoption.model.js';

describe('Adoptions Routes - Integration Test', () => {
	let user;
	let pet;

	before(async () => {
		await connectDB(config.DB_NAME_TEST);
	});

	beforeEach(async () => {
		await UserModel.deleteMany();
		await PetModel.deleteMany();
		await AdoptionModel.deleteMany();

		user = await UserModel.create({
			first_name: 'Adopter',
			last_name: 'Test',
			email: 'adopter@test.com',
			password: 'hashedpassword',
			pets: [],
			role: 'user',
		});

		pet = await PetModel.create({
			name: 'Buddy',
			specie: 'Dog',
			birthDate: '2021-01-01',
		});
	});

	after(async () => {
		await mongoose.connection.close();
	});

	it('GET /api/adoptions - getAllAdoptions -> should return 404 if no adoptions', async () => {
		const response = await request(app).get('/api/adoptions');
		expect(response.status).to.equal(404);
		expect(response.body.error).to.be.true;
	});

	it('POST /api/adoptions/:uid/:pid - createAdoption -> should create an adoption', async () => {
		const response = await request(app).post(`/api/adoptions/${user._id}/${pet._id}`);
		expect(response.status).to.equal(200);
		expect(response.body.error).to.be.false;
		expect(response.body.payload).to.have.property('_id');

		// Check that pet is marked as adopted
		const updatedPet = await PetModel.findById(pet._id);
		expect(updatedPet.adopted).to.be.true;

		// Check that user has pet in pets array
		const updatedUser = await UserModel.findById(user._id);
		expect(updatedUser.pets.length).to.equal(1);
	});

	it('POST /api/adoptions/:uid/:pid - createAdoption -> should fail if user does not exist', async () => {
		const fakeUserId = new mongoose.Types.ObjectId();
		const response = await request(app).post(`/api/adoptions/${fakeUserId}/${pet._id}`);
		expect(response.status).to.equal(404);
		expect(response.body.message).to.equal('User not found');
	});

	it('POST /api/adoptions/:uid/:pid - createAdoption -> should fail if pet does not exist', async () => {
		const fakePetId = new mongoose.Types.ObjectId();
		const response = await request(app).post(`/api/adoptions/${user._id}/${fakePetId}`);
		expect(response.status).to.equal(404);
		expect(response.body.message).to.equal('Pet not found');
	});

	it('POST /api/adoptions/:uid/:pid -> should fail if pet is already adopted', async () => {
		// Mark pet as adopted
		pet.adopted = true;
		await pet.save();

		const response = await request(app).post(`/api/adoptions/${user._id}/${pet._id}`);
		expect(response.status).to.equal(400);
		expect(response.body.message).to.equal('Pet is already adopted');
	});

	it('GET /api/adoptions - getAllAdoptions -> should return adoptions after creation', async () => {
		await request(app).post(`/api/adoptions/${user._id}/${pet._id}`);
		const response = await request(app).get('/api/adoptions');
		expect(response.status).to.equal(200);
		expect(response.body.error).to.be.false;
		expect(response.body.payload.length).to.equal(1);
	});

	it('GET /api/adoptions/:aid- getAdoption -> should return adoption by ID', async () => {
		const adoption = await AdoptionModel.create({
			owner: user._id,
			pet: pet._id,
		});

		const response = await request(app).get(`/api/adoptions/${adoption._id}`);
		expect(response.status).to.equal(200);
		expect(response.body.payload).to.have.property('_id');
		expect(response.body.payload.owner._id.toString()).to.equal(user._id.toString());
	});

	it('GET /api/adoptions/:aid - getAdoption -> should fail if adoption not found', async () => {
		const fakeAdoptionId = new mongoose.Types.ObjectId();
		const response = await request(app).get(`/api/adoptions/${fakeAdoptionId}`);
		expect(response.status).to.equal(404);
		expect(response.body.message).to.equal('Adoption not found');
	});
});
