const bcrypt = require('bcrypt');
const { Model } = require('sequelize');
/**
 * The User model.
 *
 * @typedef {import('sequelize').Model} Model
 * @typedef {import('sequelize').DataTypes} DataTypes
 * @typedef {import('sequelize').Sequelize} Sequelize
 * @typedef {import('./index')} Models
 *
 * @param {Sequelize} sequelize - The sequelize instance.
 * @param {DataTypes} DataTypes - The data types.
 * @returns {Model} The User model.
 */
module.exports = (sequelize, DataTypes) => {
  /**
   * The User model class.
   *
   * @class User
   * @extends {Model}
   */
  class User extends Model {
    /**
     * Define model associations.
     *
     * @static
     * @param {Models} models - The sequelize models object.
     * @memberof User
     */
    static associate(models) {
      // define association here
      // this.belongsTo(models.Role, { foreignKey: 'roleId' });
      // this.belongsTo(models.School);
      this.hasMany(models.UserCourse);
      this.hasMany(models.Announcement);
    }

    /**
     * Check if a given password matches the user's password.
     *
     * @async
     * @param {string} password - The password to check.
     * @returns {Promise<boolean>} A Promise that resolves to true if the password matches, or false if it doesn't.
     * @memberof User
     */
    async checkPassword(password) {
      return bcrypt.compare(password, this.password);
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      sequelize,
      tableName: 'Users',
      modelName: 'User',
    }
  );

  /**
   * Hash the user password before updating an existing record, but only if the password field has changed.
   *
   * @param {User} user - The user instance being updated.
   * @returns {Promise<void>} A Promise that resolves when the hook is complete.
   */
  User.beforeSave(async (user) => {
    // We only want to hash the password if it not already hashed.
    if (user.changed('password')) {
      const password = await bcrypt.hash(user.password, 10);
      user.set('password', password);
    }
  });

  return User;
};
