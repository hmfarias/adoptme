import app from '../../src/app.js';
import mongoose from 'mongoose';
import request from 'supertest';
import { expect } from 'chai';
import PetModel from '../../src/dao/models/pet.model.js';
import { connectDB } from '../../src/config/database.config.js';
import { config } from '../../src/config/config.js';

const mockPetDog = {
	name: 'Firulais',
	specie: 'Dog',
	birthDate: '2020-01-01',
	image: 'https://example.com/firulais.jpg',
};

const mockPetCat = {
	name: 'Michi',
	specie: 'Cat',
	birthDate: '2021-05-01',
	image: 'https://example.com/michi.jpg',
};

describe('Pets Routes - Integration Test', () => {
	before(async () => {
		await connectDB(config.DB_NAME);
	});

	beforeEach(async () => {
		await PetModel.deleteMany();
	});

	after(async () => {
		await mongoose.connection.close();
	});

	it('GET - getAllPets /api/pets → should return empty array initially', async () => {
		const response = await request(app).get('/api/pets');
		expect(response.status).to.equal(404);
		expect(response.body).to.have.property('error', true);
	});

	it('GET - getAllPets /api/pets → should return pets after insertions', async () => {
		await PetModel.insertMany([mockPetDog, mockPetCat]);

		const response = await request(app).get('/api/pets');
		expect(response.status).to.equal(200);
		expect(response.body.payload).to.be.an('array').with.lengthOf(2);
		expect(response.body.payload[0]).to.include.keys('_id', 'name', 'specie');
	});

	it('POST - createPet /api/pets → should create a pet', async () => {
		const response = await request(app).post('/api/pets').send(mockPetDog);
		expect(response.status).to.equal(200);
		expect(response.body.payload).to.have.property('_id');
		expect(response.body.payload.name).to.equal(mockPetDog.name);
	});

	it('GET - getPet /api/pets/:pid → should return the created pet', async () => {
		const pet = await PetModel.create(mockPetCat);
		const response = await request(app).get(`/api/pets/${pet._id}`);
		expect(response.status).to.equal(200);
		expect(response.body.payload.name).to.equal(mockPetCat.name);
	});

	it('PUT - updatePet /api/pets/:pid → should update a pet', async () => {
		const pet = await PetModel.create(mockPetCat);
		const response = await request(app)
			.put(`/api/pets/${pet._id}`)
			.send({ adopted: true });

		expect(response.status).to.equal(200);
		expect(response.body.payload.adopted).to.be.true;
	});

	it('DELETE - deletePet /api/pets/:pid → should delete a pet', async () => {
		const pet = await PetModel.create(mockPetDog);
		const response = await request(app).delete(`/api/pets/${pet._id}`);
		expect(response.status).to.equal(200);

		const confirm = await request(app).get(`/api/pets/${pet._id}`);
		expect(confirm.status).to.equal(404);
	});

	it('POST - createPet /api/pets → should fail with missing fields', async () => {
		const incompleteData = { name: 'NoSpecie', birthDate: '2022-01-01' };
		const response = await request(app).post('/api/pets').send(incompleteData);
		expect(response.status).to.equal(400);
	});

	it('PUT - /api/pets/:pid → should return 422 if pet does not exist', async () => {
		const fakeId = '64a1b2c3d4e5f6a7b8c9d0e1';
		const response = await request(app)
			.put(`/api/pets/${fakeId}`)
			.send({ adopted: true });

		expect(response.status).to.equal(422);
	});

	it('POST - createPetWithImage /api/pets/withImage → should create pet with uploaded image', async () => {
		const response = await request(app)
			.post('/api/pets/withImage')
			.field('name', 'Toby')
			.field('specie', 'Dog')
			.field('birthDate', '2019-11-11')
			.attach('image', './test/coderDog.jpg');

		expect(response.status).to.equal(200);
		expect(response.body.payload).to.have.property('_id');
		expect(response.body.payload).to.have.property('image');
		expect(response.body.payload.image).to.be.ok;
	});
});
