import UserDAO from '../dao/user.dao.js';
import PetDAO from '../dao/pet.dao.js';
import AdoptionDAO from '../dao/adoption.dao.js';

import UserRepository from '../repository/user.repository.js';
import PetRepository from '../repository/pet.repository.js';
import AdoptionRepository from '../repository/adoption.repository.js';

export const usersService = new UserRepository(new UserDAO());
export const petsService = new PetRepository(new PetDAO());
export const adoptionsService = new AdoptionRepository(new AdoptionDAO());
