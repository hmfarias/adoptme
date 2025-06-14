import mongoose from 'mongoose';

const collection = 'Adoptions';

const schema = new mongoose.Schema({
	owner: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'Users',
	},
	pet: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'Pets',
	},
});

const AdoptionModel = mongoose.model(collection, schema);

export default AdoptionModel;
