import { createHash, passwordValidation } from '../../src/utils/index.js';
import { expect } from 'chai';
import UserDTO from '../../src/dto/user.dto.js';

describe('Utilities and UserDTO test - Unit Test', () => {
	describe('Password hashing and validation', () => {
		const plainPassword = 'DifficultPasword';

		it('createHash() -> Should create a hash and validate with original password', async () => {
			const hashedPassword = await createHash(plainPassword);

			const mockUser = {
				password: hashedPassword,
			};

			const isValid = await passwordValidation(mockUser, plainPassword);
			expect(isValid).to.be.true;
		});

		it('createHash() -> Should return false if password is wrong', async () => {
			const hashedPassword = await createHash(plainPassword);

			const mockUser = {
				password: hashedPassword,
			};

			const isValid = await passwordValidation(mockUser, 'WrongPassword');
			expect(isValid).to.be.false;
		});
	});

	describe('UserDTO - getUserTokenFrom()', () => {
		it('getUserTokenFrom() -> Should return expected token fields without password', () => {
			const user = {
				first_name: 'Jane',
				last_name: 'Doe',
				email: 'jane@example.com',
				password: 'secret',
				role: 'admin',
			};

			const tokenUser = UserDTO.getUserTokenFrom(user);

			expect(tokenUser).to.deep.equal({
				name: 'Jane Doe',
				role: 'admin',
				email: 'jane@example.com',
			});
		});
	});

	describe('UserDTO - getUserResponseFrom()', () => {
		it('Should return full user object including pets array and no password', () => {
			const user = {
				_id: '123',
				first_name: 'John',
				last_name: 'Smith',
				email: 'john@example.com',
				password: 'secret',
				role: 'user',
				pets: ['pet1', 'pet2'],
			};

			const responseUser = UserDTO.getUserResponseFrom(user);

			expect(responseUser).to.deep.equal({
				_id: '123',
				first_name: 'John',
				last_name: 'Smith',
				email: 'john@example.com',
				role: 'user',
				pets: ['pet1', 'pet2'],
			});
		});

		it('Should return null if no user provided', () => {
			const response = UserDTO.getUserResponseFrom(null);
			expect(response).to.be.null;
		});
	});
});
