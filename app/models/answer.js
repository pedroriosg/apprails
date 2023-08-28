'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Answer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Assessment);
      this.belongsTo(models.User);
    }
  }
  Answer.init({
    answer: DataTypes.STRING,
    score: DataTypes.INTEGER,
    total: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    AssessmentId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Answer',
  });
  return Answer;
};