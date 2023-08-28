'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AssessmentType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AssessmentType.init({
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AssessmentType',
  });
  return AssessmentType;
};