const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserCourse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Course);
      this.belongsTo(models.User);
    }
  }
  UserCourse.init(
    {
      UserId: DataTypes.INTEGER,
      CourseId: DataTypes.INTEGER,
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'UserCourse',
    }
  );
  return UserCourse;
};
