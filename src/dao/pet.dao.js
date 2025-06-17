import PetModel from './models/pet.model.js';

export default class PetDAO {
	get = (params) => {
		return PetModel.find(params);
	};

	getBy = (params) => {
		return PetModel.findOne(params);
	};

	save = (doc) => {
		return PetModel.create(doc);
	};

	saveMany = (docs) => PetModel.insertMany(docs);

	update = (id, doc) => {
		return PetModel.findByIdAndUpdate(id, { $set: doc }, { new: true });
	};

	delete = (id) => {
		return PetModel.findByIdAndDelete(id);
	};
	createMany = (docs) => {
		return PetModel.insertMany(docs);
	};
}
