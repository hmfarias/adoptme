import { th } from '@faker-js/faker';
import PetDTO from '../dto/pet.dto.js';
import { petsService } from '../services/index.js';
import { errorHandler } from '../utils.js';
import __dirname from '../utils/index.js';

const getAllPets = async (req, res) => {
	try {
		const pets = await petsService.getAll();

		if (!pets) {
			req.logger.warning('Pet list is empty');
			return res
				.status(404)
				.send({ error: true, message: 'Pets not found', payload: null });
		}

		res.send({ error: false, message: 'Pets retrieved sucessfully', payload: pets });
	} catch (error) {
		req.logger.error(`Error in getAllPets: ${error.message}`, { stack: error.stack });
		errorHandler(error, res);
	}
};

const getPet = async (req, res) => {
	try {
		const petId = req.params.pid;

		const pet = await petsService.getBy({ _id: petId });

		if (!pet) {
			req.logger.warning(`Pet not found - ID: ${petId}`);
			return res
				.status(404)
				.send({ error: true, message: 'Pet not found', payload: null });
		}

		res.send({ error: false, message: 'Pet retrieved sucessfully', payload: pet });
	} catch (error) {
		req.logger.error(`Error in getPet: ${error.message}`, { stack: error.stack });
		errorHandler(error, res);
	}
};

const createPet = async (req, res) => {
	try {
		const { name, specie, birthDate } = req.body;

		if (!name || !specie || !birthDate) {
			req.logger.warning('Incomplete values for creating a pet');
			return res
				.status(400)
				.send({ error: true, message: 'Incomplete values', payload: null });
		}

		const pet = PetDTO.getPetInputFrom({ name, specie, birthDate });
		const result = await petsService.create(pet);

		if (!result) {
			req.logger.warning('Pet not created');
			return res
				.status(404)
				.send({ error: true, message: 'Pet not created', payload: null });
		}
		res.send({ error: false, message: 'Pet created sucessfully', payload: result });
	} catch (error) {
		req.logger.error(`Error in createPet: ${error.message}`, { stack: error.stack });
		errorHandler(error, res);
	}
};

const updatePet = async (req, res) => {
	try {
		const petUpdateBody = req.body;
		if (!petUpdateBody) {
			req.logger.warning('No values provided for updating a pet');
			return res
				.status(400)
				.send({ error: true, message: 'Incomplete values', payload: null });
		}
		const petId = req.params.pid;

		const result = await petsService.update(petId, petUpdateBody);

		if (!result) {
			req.logger.warning('Pet not updated');
			return res
				.status(404)
				.send({ error: true, message: 'Pet not updated', payload: null });
		}
		res.send({ error: false, message: 'Pet updated sucessfully', payload: result });
	} catch (error) {
		req.logger.error(`Error in updatePet: ${error.message}`, { stack: error.stack });
		errorHandler(error, res);
	}
};

const deletePet = async (req, res) => {
	try {
		const petId = req.params.pid;

		const result = await petsService.delete(petId);
		if (!result) {
			req.logger.warning('Pet not deleted');
			return res
				.status(404)
				.send({ error: true, message: 'Pet not deleted', payload: null });
		}
		res.send({ error: false, message: 'Pet deleted sucessfully', payload: result });
	} catch (error) {
		req.logger.error(`Error in deletePet: ${error.message}`, { stack: error.stack });
		errorHandler(error, res);
	}
};

const createPetWithImage = async (req, res) => {
	try {
		const file = req.file;
		req.logger.info(`File received: ${file}`);
		const { name, specie, birthDate } = req.body;
		if (!name || !specie || !birthDate) {
			req.logger.warning('Incomplete values for creating a pet');
			return res
				.status(400)
				.send({ error: true, message: 'Incomplete values', payload: null });
		}

		const pet = PetDTO.getPetInputFrom({
			name,
			specie,
			birthDate,
			image: `${__dirname}/../public/img/${file.filename}`,
		});

		req.logger.info(`Pet to be created: ${pet}`);

		const result = await petsService.create(pet);
		if (!result) {
			req.logger.warning('Pet not created');
			return res
				.status(404)
				.send({ error: true, message: 'Pet not created', payload: null });
		}
		res.send({ error: false, message: 'Pet created sucessfully', payload: result });
	} catch (error) {
		req.logger.error(`Error in createPetWithImage: ${error.message}`, {
			stack: error.stack,
		});
		errorHandler(error, res);
	}
};

export default {
	getAllPets,
	getPet,
	createPet,
	updatePet,
	deletePet,
	createPetWithImage,
};
