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

// Auto-populate owner and pet on any find query
schema.pre(/^find/, function (next) {
	this.populate({
		path: 'owner',
		select: 'first_name last_name email role',
	}).populate({
		path: 'pet',
		select: 'name specie birthDate adopted',
	});
	next();
});

const AdoptionModel = mongoose.model(collection, schema);

export default AdoptionModel;
