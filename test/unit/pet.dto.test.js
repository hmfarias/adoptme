import { expect } from 'chai';
import PetDTO from '../../src/dto/pet.dto.js';

describe('PetDTO test', () => {
	describe('getPetInputFrom()', () => {
		it('getPetInputFrom() -> Should return complete pet input from valid object', () => {
			const input = {
				name: 'Firulais',
				specie: 'Dog',
				image: 'https://example.com/firu.jpg',
				birthDate: '2020-05-10',
			};

			const dto = PetDTO.getPetInputFrom(input);

			expect(dto).to.deep.equal({
				name: 'Firulais',
				specie: 'Dog',
				image: 'https://example.com/firu.jpg',
				birthDate: '2020-05-10',
				adopted: false,
			});
		});

		it('getPetInputFrom() -> Should use default values for missing fields', () => {
			const input = {};

			const dto = PetDTO.getPetInputFrom(input);

			expect(dto).to.deep.equal({
				name: '',
				specie: '',
				image: '',
				birthDate: '12-30-2000',
				adopted: false,
			});
		});

		it('getPetInputFrom() -> Should fallback to defaults if some fields are missing', () => {
			const input = {
				name: 'Michi',
			};

			const dto = PetDTO.getPetInputFrom(input);

			expect(dto).to.deep.equal({
				name: 'Michi',
				specie: '',
				image: '',
				birthDate: '12-30-2000',
				adopted: false,
			});
		});
	});
});
