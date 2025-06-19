import mongoose from 'mongoose';
import { expect } from 'chai';
import UserDAO from '../../src/dao/user.dao.js';
import PetDAO from '../../src/dao/pet.dao.js';
import UserModel from '../../src/dao/models/user.model.js';
import PetModel from '../../src/dao/models/pet.model.js';
import { connectDB } from '../../src/config/database.config.js';
import { config } from '../../src/config/config.js';

describe('UserDAO test - Unit Test', () => {
	let userDao;
	let petDao;
	let mockUser1;
	let mockUser2;
	let userList;
	let mockPet1;
	let mockPet2;

	before(async function () {
		this.timeout(5000); // Increase default time to avoid Timeout in 2 seconds

		await connectDB(config.DB_NAME); // Connect to the test database
		userDao = new UserDAO(); //  Userdao instance
		petDao = new PetDAO(); // Petdao instance to test populate
	});

	beforeEach(async function () {
		await UserModel.deleteMany(); // Clean the user collection before each test
		await PetModel.deleteMany(); // Clean the pet collection before each test

		mockPet1 = await petDao.save({
			name: 'Firulais',
			specie: 'Dog',
			birthDate: new Date('2020-01-01'),
			adopted: false,
			image: 'https://example.com/firulais.jpg',
		});

		mockPet2 = await petDao.save({
			name: 'Michi',
			specie: 'Cat',
			birthDate: new Date('2021-05-10'),
			adopted: true,
			image: 'https://example.com/michi.jpg',
		});

		mockUser1 = {
			first_name: 'Test1',
			last_name: 'User1',
			email: 'testone@example.com',
			password: 'secret1',
			pets: [mockPet1._id, mockPet2._id], // Aquí vinculamos las mascotas
		};
		mockUser2 = {
			first_name: 'Test2',
			last_name: 'User2',
			email: 'testtwo@example.com',
			password: 'secret2',
		};

		userList = [mockUser1, mockUser2];
	});

	after(async function () {
		await UserModel.deleteMany();
		await PetModel.deleteMany();

		await mongoose.connection.close();
	});

	it('get() -> should return an array of user objects', async function () {
		await userDao.save(mockUser1);
		const result = await userDao.get({});
		expect(result).to.be.an('array');
		expect(result).to.have.lengthOf(1);
		expect(result[0].email).to.equal(mockUser1.email);
	});

	it('getBy() -> should return a single user by email', async function () {
		await userDao.save(mockUser1);
		const result = await userDao.getBy({ email: mockUser1.email });
		expect(result).to.exist;
		expect(result.first_name).to.equal(mockUser1.first_name);
	});

	it('getBy() -> should return a single user by _id', async function () {
		const savedUser = await userDao.save(mockUser1);
		const result = await userDao.getBy({ _id: savedUser._id });
		expect(result).to.exist;
		expect(result.first_name).to.equal(mockUser1.first_name);
	});

	it('save() -> should create a new user', async function () {
		const result = await userDao.save(mockUser1);
		expect(result).to.have.property('_id');
		expect(result.email).to.equal(mockUser1.email);
	});

	it('save() -> should create a new user with an empty pet array', async function () {
		const result = await userDao.save(mockUser2);
		expect(result.pets).to.be.an('array').that.is.empty;
	});

	it('save() -> should not allow saving a user without required fields', async function () {
		try {
			await userDao.save({
				first_name: 'Missing',
				last_name: 'Email',
				password: '123', // falta el campo email
			});
			expect.fail('Expected validation error was not thrown');
		} catch (err) {
			expect(err).to.exist;
			expect(err.name).to.equal('ValidationError');
		}
	});

	it('save() -> should not allow saving two users with the same email', async function () {
		await userDao.save(mockUser1);
		try {
			await userDao.save(mockUser1); // mismo email
			expect.fail('Expected unique email constraint to throw');
		} catch (err) {
			expect(err).to.exist;
			expect(err.message).to.include('duplicate key');
		}
	});

	it('update() -> should update an existing user', async function () {
		const created = await userDao.save(mockUser1);
		const updated = await userDao.update(created._id, { first_name: 'Updated' });
		expect(updated.first_name).to.equal('Updated');
	});

	it('delete() -> should delete a user by ID', async function () {
		const created = await userDao.save(mockUser1);
		await userDao.delete(created._id);
		const result = await userDao.getBy({ _id: created._id });
		expect(result).to.be.null;
	});

	it('saveMany() -> should insert multiple users', async function () {
		const result = await userDao.saveMany(userList);
		expect(result).to.have.lengthOf(2);

		const allUsers = await userDao.get({});
		expect(allUsers).to.have.lengthOf(2);
	});

	// Populate test----------
	describe('User with populate test', () => {
		it('save() and getBy() should populate pets', async () => {
			const savedUser = await userDao.save(mockUser1);

			// Traigo el usuario con populate
			const userWithPets = await userDao.getBy({ _id: savedUser._id });

			expect(userWithPets).to.exist;
			expect(userWithPets.pets).to.be.an('array').with.lengthOf(2);

			// Verifico que las mascotas estén pobladas (tengan nombre, especie, etc)
			expect(userWithPets.pets[0]).to.have.property('name', 'Firulais');
			expect(userWithPets.pets[1]).to.have.property('name', 'Michi');
		});

		it('get() should return users with populated pets', async () => {
			await userDao.save(mockUser1);

			const users = await userDao.get({});

			expect(users).to.be.an('array').with.lengthOf(1);
			expect(users[0].pets).to.be.an('array').with.lengthOf(2);
			expect(users[0].pets[0]).to.have.property('specie', 'Dog');
		});
	});
});
