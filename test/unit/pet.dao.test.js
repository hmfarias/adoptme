import mongoose from 'mongoose';
import { expect } from 'chai';
import PetDAO from '../../src/dao/pet.dao.js';
import PetModel from '../../src/dao/models/pet.model.js';
import UserModel from '../../src/dao/models/user.model.js';
import { connectDB } from '../../src/config/database.config.js';
import { config } from '../../src/config/config.js';

// Evita OverwriteModelError si UserModel ya fue registrado en otros tests
if (!mongoose.models.Users) {
	mongoose.model('Users', new mongoose.Schema({}));
}

describe('PetDAO test', () => {
	let petDao;
	let mockPet1;
	let mockPet2;
	let petList;

	before(async function () {
		this.timeout(5000);
		await connectDB(config.DB_NAME);
		petDao = new PetDAO();
	});

	beforeEach(async function () {
		await PetModel.deleteMany();

		mockPet1 = {
			name: 'Firulais',
			specie: 'Dog',
			birthDate: new Date('2020-01-01'),
			adopted: false,
			image: 'https://example.com/firulais.jpg',
		};

		mockPet2 = {
			name: 'Michi',
			specie: 'Cat',
			birthDate: new Date('2021-05-10'),
			adopted: true,
			image: 'https://example.com/michi.jpg',
		};

		petList = [mockPet1, mockPet2];
	});

	after(async function () {
		await PetModel.deleteMany();
		await mongoose.connection.close();
	});

	it('get() -> should return pet array', async function () {
		await petDao.save(mockPet1);
		const result = await petDao.get({});
		expect(result).to.be.an('array').with.lengthOf(1);
		expect(result[0].name).to.equal(mockPet1.name);
	});

	it('getBy() -> should return pet by name', async function () {
		await petDao.save(mockPet2);
		const result = await petDao.getBy({ name: mockPet2.name });
		expect(result).to.exist;
		expect(result.specie).to.equal('Cat');
	});

	it('getBy() -> should return pet by _id', async function () {
		const saved = await petDao.save(mockPet1);
		const result = await petDao.getBy({ _id: saved._id });
		expect(result).to.exist;
		expect(result.name).to.equal(mockPet1.name);
	});

	it('save() -> should create a pet', async function () {
		const result = await petDao.save(mockPet1);
		expect(result).to.have.property('_id');
		expect(result.name).to.equal(mockPet1.name);
	});

	it('save() -> should fail if specie is missing', async function () {
		try {
			await petDao.save({ name: 'NoSpecie' });
			expect.fail('Expected validation error');
		} catch (err) {
			expect(err).to.exist;
			expect(err.name).to.equal('ValidationError');
		}
	});

	it('update() -> should change adopted to true', async function () {
		const created = await petDao.save(mockPet1);
		const updated = await petDao.update(created._id, { adopted: true });
		expect(updated.adopted).to.be.true;
	});

	it('delete() -> should remove a pet by ID', async function () {
		const created = await petDao.save(mockPet1);
		await petDao.delete(created._id);
		const result = await petDao.getBy({ _id: created._id });
		expect(result).to.be.null;
	});

	it('saveMany() -> should insert multiple pets', async function () {
		const result = await petDao.saveMany(petList);
		expect(result).to.have.lengthOf(2);

		const all = await petDao.get({});
		expect(all).to.have.lengthOf(2);
	});

	it('createMany() -> should also insert multiple pets', async function () {
		const result = await petDao.createMany(petList);
		expect(result).to.have.lengthOf(2);

		const all = await petDao.get({});
		expect(all).to.have.lengthOf(2);
	});
});
