import AdoptionModel from './models/adoption.model.js';

export default class AdoptionDAO {
	get = (params) => {
		return AdoptionModel.find(params);
	};

	getBy = (params) => {
		return AdoptionModel.findOne(params);
	};

	save = (doc) => {
		return AdoptionModel.create(doc);
	};

	update = (id, doc) => {
		return AdoptionModel.findByIdAndUpdate(id, { $set: doc }, { new: true });
	};

	delete = (id) => {
		return AdoptionModel.findByIdAndDelete(id);
	};
}
