import mongoose from 'mongoose';
import { expect } from 'chai';
import AdoptionDAO from '../../src/dao/adoption.dao.js';
import PetDAO from '../../src/dao/pet.dao.js';
import UserDAO from '../../src/dao/user.dao.js';
import AdoptionModel from '../../src/dao/models/adoption.model.js';
import PetModel from '../../src/dao/models/pet.model.js';
import UserModel from '../../src/dao/models/user.model.js';
import { connectDB } from '../../src/config/database.config.js';
import { config } from '../../src/config/config.js';

describe('AdoptionDAO test - Unit Test', () => {
	let adoptionDao;
	let userDao;
	let petDao;
	let mockUser;
	let mockPet;
	let mockAdoption;

	before(async function () {
		this.timeout(5000);
		await connectDB(config.DB_NAME);
		adoptionDao = new AdoptionDAO();
		userDao = new UserDAO();
		petDao = new PetDAO();
	});

	beforeEach(async function () {
		await AdoptionModel.deleteMany();
		await UserModel.deleteMany();
		await PetModel.deleteMany();

		// Crear usuario y mascota
		mockUser = await userDao.save({
			first_name: 'Adopter',
			last_name: 'User',
			email: 'adopter@example.com',
			password: 'secret',
		});

		mockPet = await petDao.save({
			name: 'Adoptame',
			specie: 'Dog',
			birthDate: new Date('2022-01-01'),
			adopted: false,
			image: 'https://example.com/adoptame.jpg',
		});

		// Crear adopción con las referencias
		mockAdoption = {
			owner: mockUser._id,
			pet: mockPet._id,
		};
	});

	after(async function () {
		await UserModel.deleteMany();
		await PetModel.deleteMany();
		await mongoose.connection.close();
	});

	it('save() -> should create a new adoption', async function () {
		const result = await adoptionDao.save(mockAdoption);
		expect(result).to.have.property('_id');
		expect(result.owner.toString()).to.equal(mockUser._id.toString());
		expect(result.pet.toString()).to.equal(mockPet._id.toString());
	});

	it('getBy() -> should return populated owner and pet by adoption ID', async function () {
		const saved = await adoptionDao.save(mockAdoption);
		const result = await adoptionDao.getBy({ _id: saved._id });

		expect(result).to.exist;
		expect(result.owner).to.have.property('email', 'adopter@example.com');
		expect(result.pet).to.have.property('name', 'Adoptame');
	});

	it('get() -> should return list of adoptions with populated fields', async function () {
		await adoptionDao.save(mockAdoption);
		const result = await adoptionDao.get({});

		expect(result).to.be.an('array').with.lengthOf(1);
		expect(result[0].owner).to.have.property('first_name', 'Adopter');
		expect(result[0].pet).to.have.property('specie', 'Dog');
	});

	it('update() -> should update the adoption reference (owner)', async function () {
		const saved = await adoptionDao.save(mockAdoption);

		const newUser = await userDao.save({
			first_name: 'New',
			last_name: 'Owner',
			email: 'newowner@example.com',
			password: 'newsecret',
		});

		const updated = await adoptionDao.update(saved._id, { owner: newUser._id });

		expect(updated.owner).to.have.property('first_name', 'New');
	});

	it('delete() -> should remove an adoption by ID', async function () {
		const saved = await adoptionDao.save(mockAdoption);
		await adoptionDao.delete(saved._id);

		const result = await adoptionDao.getBy({ _id: saved._id });
		expect(result).to.be.null;
	});
});
