import { adoptionsService, petsService, usersService } from '../services/index.js';

const getAllAdoptions = async (req, res) => {
	try {
		const result = await adoptionsService.getAll();
		if (!result || result.length === 0) {
			req.logger.warning('Adoption list is empty');
			return res.send({ status: 'success', payload: result });
		}
		req.logger.info(`Adoptions retrieved successfully - Total: ${result.length}`);

		res.send({ status: 'success', payload: result });
	} catch (error) {
		req.logger.error(`Error in getAllAdoptions: ${error.message}`, {
			stack: error.stack,
		});
		res.status(500).send({ status: 'error', error: error.message });
	}
};

const getAdoption = async (req, res) => {
	try {
		const adoptionId = req.params.aid;
		const adoption = await adoptionsService.getBy({ _id: adoptionId });

		if (!adoption) {
			req.logger.warning(`Adoption not found - ID: ${adoptionId}`);
			return res.status(404).send({ status: 'error', error: 'Adoption not found' });
		}
		res.send({ status: 'success', payload: adoption });
	} catch (error) {
		req.logger.error(`Error in getAdoption: ${error.message}`, { stack: error.stack });
		res.status(500).send({ status: 'error', error: error.message });
	}
};

const createAdoption = async (req, res) => {
	try {
		const { uid, pid } = req.params;

		const user = await usersService.getUserById(uid);
		if (!user) {
			req.logger.warning(`User not found - ID: ${uid}`);
			return res.status(404).send({ status: 'error', error: 'user Not found' });
		}

		const pet = await petsService.getBy({ _id: pid });
		if (!pet) {
			req.logger.warning(`Pet not found - ID: ${pid}`);
			return res.status(404).send({ status: 'error', error: 'Pet not found' });
		}

		if (pet.adopted) {
			req.logger.warning(`Pet is already adopted - ID: ${pid}`);
			return res.status(400).send({ status: 'error', error: 'Pet is already adopted' });
		}

		user.pets.push(pet._id);
		await usersService.update(user._id, { pets: user.pets });
		await petsService.update(pet._id, { adopted: true, owner: user._id });
		await adoptionsService.create({ owner: user._id, pet: pet._id });
		res.send({ status: 'success', message: 'Pet adopted' });
	} catch (error) {
		req.logger.error(`Error in createAdoption: ${error.message}`, { stack: error.stack });
		res.status(500).send({ status: 'error', error: error.message });
	}
};

export default {
	createAdoption,
	getAllAdoptions,
	getAdoption,
};
