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
		return UserModel.findByIdAndUpdate(id, { $set: doc }, { new: true }).populate(
			'pets._id'
		);
	};

	delete = (id) => {
		return UserModel.findByIdAndDelete(id);
	};
	saveMany = (docs) => {
		return UserModel.insertMany(docs);
	};
}
