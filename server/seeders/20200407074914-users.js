'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@test.com',
        password: '8e8b148b9c53988f', //hash for Test@123
        role: 'BASIC',
        employee_id: 'EMP001'
      },
      {
        first_name: 'Manager',
        last_name: 'Doe',
        email: 'manager@test.com',
        password: '8e8b148b9c53988f',
        role: 'MANAGER',
        employee_id: 'EMP002'
      },
      {
        first_name: 'Admin',
        last_name: 'Doe',
        email: 'admin@test.com',
        password: '8e8b148b9c53988f',
        role: 'ADMIN',
        employee_id: 'EMP003'
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
