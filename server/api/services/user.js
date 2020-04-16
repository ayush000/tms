`use strict`;
const logger = require('winston');

const db = require('./../../models');
const authenticate = require('./../helpers/authenticate');

const ROLES = authenticate.ROLES;

const createUser = async user => {
  try {
    if (user.role !== ROLES.BASIC && user.preferredWorkingHourPerDay !== null) {
      throw new Error('Cannot set preferred Working Hours for admin and managers');
    }

    user.password = authenticate.encrypt(user.password);

    const createdUser = await db.User.create(user);
    return createdUser;

  } catch (error) {
    logger.error(error);
    throw new Error(error.message);
  }
}

const register = async user => {
  try {

    user.password = authenticate.encrypt(user.password);

    const createdUser = await db.User.create(user);
    return createdUser;

  } catch (error) {
    logger.error(error);
    throw new Error(error.message);
  }
}

const getUserByEmail = async email => {

  const user = await db.User.findOne({
    where: { email }
  });
  if (user) {
    user.password = authenticate.decrypt(user.password);
  }
  return user;
}

const getUserById = async (auth, id) => {

  try {
    const user = await db.User.findOne({
      where: { id }
    });
    if (!user) {
      throw new Error('User does not exist');
    } else {
      if (auth.role === ROLES.BASIC && auth.id !== user.id) {
        throw new Error('Cannot fetch details of other users');
      }

      user.password = authenticate.decrypt(user.password);

      return user;
    }

  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
}

const getAllUsers = async (requestRole, page, limit) => {
  let role;
  const offset = limit * (page - 1);
  if (requestRole === ROLES.ADMIN) {
    role = [ROLES.BASIC, ROLES.MANAGER, ROLES.ADMIN];
  } else {
    role = ROLES.BASIC;
  }

  try {
    let users = await db.User.findAndCountAll({
      limit,
      offset,
      where: {
        role
      }
    });

    users.rows = users.rows.map(user => {
      const { password, ...rest } = user.dataValues;
      return rest;
    });

    return users;
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
}

const updateUser = async (auth, userToUpdate, userId) => {
  try {
    if (userToUpdate.password) {
      userToUpdate.password = authenticate.encrypt(userToUpdate.password);
    }

    let user = await db.User.findOne({
      where: {
        id: userId
      }
    });

    if (!user) {
      throw new Error('User doesnot exist');
    } else if (auth.id !== user.id) {

      //admins can update users, managers and other admins, 
      //managers can update only other users and not other managers or admins
      //User can update only their own details
      if (auth.role === ROLES.BASIC) {
        throw new Error('Trying to update request of other user');
      } else {
        let authUser = await db.User.findOne({
          where: {
            id: auth.id
          }
        });

        if (!authUser) {
          throw new Error('User doesnot exist');
        } else {
          if (auth.role === ROLES.MANAGER && user.role !== ROLES.BASIC) {
            throw new Error('Trying to update request of admin or another manager');
          }
        }
      }
    }

    let updatedUser = await user.update(userToUpdate);

    return updatedUser;
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
}

const deleteUser = async (auth, id) => {
  try {

    let user = await db.User.findOne({
      where: {
        id
      }
    });

    if (!user) {
      throw new Error('User doesnot exist');
    } else {

      //admins can delete users, managers and other admins, 
      //managers can delete only other users and not other managers or admins
      if (auth.role === ROLES.MANAGER && user.role !== ROLES.BASIC) {
        throw new Error('Managers can delete users only.');
      } else if (auth.role === ROLES.ADMIN && user.id === auth.id) {
        throw new Error('Cannot delete own account');
      }

      await db.User.destroy({
        where: {
          id
        }
      });

      return { message: 'User Deleted' };
    }
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
}

module.exports = {
  getUserByEmail,
  getUserById,
  getAllUsers,
  createUser,
  register,
  updateUser,
  deleteUser,
}