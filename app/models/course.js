const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Announcement);
      this.hasMany(models.UserCourse);
      this.belongsTo(models.School);
      this.belongsTo(models.Subject);
      this.belongsTo(models.Grade);
      
    }
  }
  Course.init(
    {
      name: DataTypes.STRING,
      driveUrl: DataTypes.TEXT,
      calendarUrl: DataTypes.TEXT,
      SchoolId: DataTypes.INTEGER,
      SubjectId: DataTypes.INTEGER,
      GradeId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Course',
    }
  );
  return Course;
};
