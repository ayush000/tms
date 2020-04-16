'use strict';
const logger = require('winston');
const authenticate = require('./../helpers/authenticate');
const userService = require('./../services/user');

const ROLES = authenticate.ROLES;

const createUser = async (request, response) => {
  logger.info('Received request to create a new user');

  if (request.auth.role === ROLES.MANAGER && request.body.role !== ROLES.BASIC) {
    return response.status(400).send('Managers can only create user with role BASIC');
  }

  const userInDatabase = await userService.getUserByEmail(request.body.email);

  if (userInDatabase) {
    return response.status(409).send('User Already Present');
  }
  try {
    await userService.createUser(request.body);

    return response.send({ message: 'User Created Successfully' });
  } catch (error) {

    logger.error(`Error while creating new User.`);
    return response.status(500).send(error.message);
  }
}

const register = async (request, response) => {
  logger.info('Received request to register a new user');

  const userInDatabase = await userService.getUserByEmail(request.body.email);

  if (userInDatabase) {
    return response.status(400).send('User Already Present');
  }
  try {
    await userService.register(request.body);

    return response.send({ message: 'User Registered Successfully' });
  } catch (error) {

    logger.error(`Error while registering new User.`);
    return response.status(500).send(error.message);
  }
}

const login = async (request, response) => {

  logger.info('Received request for user login');

  try {

    let user = await userService.getUserByEmail(request.body.email);

    if (!user || (user.password !== request.body.password)) {
      return response.status(401).send('Invalid Credentials');
    } else {
      const token = authenticate.generateToken({ id: user.id, role: user.role, email: user.email, firstName: user.firstName, lastName: user.lastName });
      return response.send(token);
    }

  } catch (error) {
    return response.status(500).send(error.message);
  }


};

const getAll = async (request, response) => {

  logger.info('Received request for user login');
  logger.debug(request.auth);

  const page = request.swagger.params.page.value ? request.swagger.params.page.value : 1;
  const limit = request.swagger.params.limit.value ? request.swagger.params.limit.value : 5;

  try {
    let users = await userService.getAllUsers(request.auth.role, page, limit);
    logger.debug(users);

    return response.send(users);
  }
  catch (error) {
    return response.status(500).send('Error while fetching users', error.message);
  }
}

const update = async (request, response) => {
  logger.info('Received request for user update');

  try {

    let user = await userService.updateUser(request.auth, request.body, request.swagger.params.userId.value);
    return response.send(user);

  } catch (error) {
    return response.status(500).send(error.message);
  }
}


const deleteUser = async (request, response) => {
  logger.info('Recieved request to delete user');

  try {

    let message = await userService.deleteUser(request.auth, request.swagger.params.userId.value);
    return response.send(message);

  } catch (error) {
    return response.status(500).send(error.message);
  }
}

const get = async (request, response) => {
  logger.info('Request Recieved to get single user');

  try {
    const user = await userService.getUserById(request.auth, request.swagger.params.userId.value);
    logger.debug(user);
    return response.send(user);
  } catch (error) {
    return response.status(500).send(error.message);
  }

}

module.exports = {
  register,
  login,
  createUser,
  get,
  getAll,
  update,
  deleteUser,
};


