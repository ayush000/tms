const path = require('path');

module.exports = (
  Sequelize,
  DataTypes
) => {
  const Timelog = Sequelize.define(
    'Timelog',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        validate: {
          isNumeric: true,
        },
      },
      loggedAt: {
        type: DataTypes.DATEONLY,
        field: 'logged_at',
        allowNull: false
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      notes: {
        type: DataTypes.STRING(2000),
        validate: {
          notEmpty: true,
          len: [1, 2000],
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isNumeric: true,
        },
        field: 'user_id',
        references: {
          model: 'Users',
          key: 'id',
        }
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

  return Timelog;
}
