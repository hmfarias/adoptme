import UserModel from './models/user.model.js';

export default class UserDAO {
	get = (params) => {
		return UserModel.find(params).populate('pets');
	};

	getBy = (params) => {
		return UserModel.findOne(params).populate('pets');
	};

	save = (doc) => {
		return UserModel.create(doc);
	};

	update = (id, doc) => {
		// If the DOC already includes Mongo operators, do not use $set
		const usesOperator = Object.keys(doc).some((key) => key.startsWith('$'));
		const updatePayload = usesOperator ? doc : { $set: doc };

		return UserModel.findByIdAndUpdate(id, updatePayload, { new: true }).populate('pets');
	};

	delete = (id) => {
		return UserModel.findByIdAndDelete(id);
	};
	saveMany = (docs) => {
		return UserModel.insertMany(docs);
	};
}
