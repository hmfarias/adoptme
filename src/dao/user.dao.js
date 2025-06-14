import UserModel from './models/user.model.js';

export default class UserDAO {
	get = (params) => {
		return UserModel.find(params);
	};

	getBy = (params) => {
		return UserModel.findOne(params);
	};

	save = (doc) => {
		return UserModel.create(doc);
	};

	update = (id, doc) => {
		return UserModel.findByIdAndUpdate(id, { $set: doc });
	};

	delete = (id) => {
		return UserModel.findByIdAndDelete(id);
	};
	saveMany = (docs) => {
		return UserModel.insertMany(docs);
	};
}
