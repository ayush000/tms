const path = require('path');

const ROLES = require('./../api/helpers/authenticate').ROLES;


module.exports = (
  Sequelize,
  DataTypes
) => {
  const User = Sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        validate: {
          isNumeric: true,
        },
      },
      email: {
        type: DataTypes.STRING(80),
        allowNull: false,
        unique: 'composite_key',
        validate: {
          isEmail: true,
          notEmpty: true,
          len: [1, 80],
        },
      },
      password: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      firstName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 50],
        },
        field: 'first_name',
      },
      lastName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notEmpty: false,
          len: [1, 50],
        },
        field: 'last_name',
      },
      role: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: [ROLES.BASIC, ROLES.ADMIN, ROLES.MANAGER],
        defaultValue: ROLES.BASIC,
      },
      employeeId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: 'compositeIndex',
        validate: {
          notEmpty: true,
          len: [1, 80],
        },
        field: 'employee_id'
      },
      preferredWorkingHourPerDay: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      }
    }
  );

  const Timelog = Sequelize.import(
    path.join(__dirname, 'timelog')
  );
  User.hasOne(Timelog, {
    as: 'timelog',
    foreignKey: 'userId',
    onDelete: 'CASCADE',
  });

  return User;
}
