'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Assessment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.AssessmentCourse);
      this.hasMany(models.Answer)
      this.belongsTo(models.AssessmentType)
    }
  }
  Assessment.init({
    name: DataTypes.STRING,
    dateIn: DataTypes.DATE,
    dateOut: DataTypes.DATE,
    correctAnswer: DataTypes.STRING,
    AssessmentTypeId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Assessment',
  });
  return Assessment;
};