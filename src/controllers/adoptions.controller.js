import { error } from 'console';
import { adoptionsService, petsService, usersService } from '../services/index.js';

const getAllAdoptions = async (req, res) => {
	try {
		const result = await adoptionsService.getAll();
		if (!result || result.length === 0) {
			req.logger.warning('Adoption list is empty');
			return res
				.status(404)
				.send({ error: true, message: 'Adoptions not found', payload: null });
		}

		req.logger.info(`Adoptions retrieved successfully - Total: ${result.length}`);
		res.send({
			error: false,
			message: 'Adoptions retrieved successfully',
			payload: result,
		});
	} catch (error) {
		req.logger.error(`Error in getAllAdoptions: ${error.message}`, {
			stack: error.stack,
		});
		res.status(500).json({
			error: true,
			message: 'Unexpected server error - Try later or contact your administrator',
			payload: null,
		});
	}
};

const getAdoption = async (req, res) => {
	try {
		const adoptionId = req.params.aid;
		const adoption = await adoptionsService.getBy({ _id: adoptionId });

		if (!adoption) {
			req.logger.warning(`Adoption not found - ID: ${adoptionId}`);
			return res
				.status(404)
				.send({ error: true, message: 'Adoption not found', payload: null });
		}
		res.send({
			error: false,
			message: 'Adoption retrieved successfully',
			payload: adoption,
		});
	} catch (error) {
		req.logger.error(`Error in getAdoption: ${error.message}`, { stack: error.stack });
		res.status(500).json({
			error: true,
			message: 'Unexpected server error - Try later or contact your administrator',
			payload: null,
		});
	}
};

const createAdoption = async (req, res) => {
	try {
		const { uid, pid } = req.params;

		const user = await usersService.getUserById(uid);
		if (!user) {
			req.logger.warning(`User not found - ID: ${uid}`);
			return res
				.status(404)
				.send({ error: true, message: 'User not found', payload: null });
		}

		const pet = await petsService.getBy({ _id: pid });
		if (!pet) {
			req.logger.warning(`Pet not found - ID: ${pid}`);
			return res
				.status(404)
				.send({ error: true, message: 'Pet not found', payload: null });
		}

		if (pet.adopted) {
			req.logger.warning(`Pet is already adopted - ID: ${pid}`);
			return res
				.status(400)
				.send({ error: true, message: 'Pet is already adopted', payload: null });
		}

		// Update the user
		// user.pets.push(pet._id);
		await usersService.update(user._id, {
			$push: { pets: { _id: pet._id } },
		});

		// Update the pet
		await petsService.update(pet._id, { adopted: true, owner: user._id });

		// Create the adoption
		const adoption = await adoptionsService.create({ owner: user._id, pet: pet._id });
		if (!adoption) {
			req.logger.warning('Adoption could not be created');
			return res
				.status(422)
				.send({ error: true, message: 'Adoption could not be created', payload: null });
		}
		res.send({ error: false, message: 'Pet adopted', payload: adoption });
	} catch (error) {
		req.logger.error(`Error in createAdoption: ${error.message}`, { stack: error.stack });
		res.status(500).json({
			error: true,
			message: 'Unexpected server error - Try later or contact your administrator',
			payload: null,
		});
	}
};

export default {
	createAdoption,
	getAllAdoptions,
	getAdoption,
};
