const path = require('path');
const filePath = path.join(__dirname, '../csv/assessments.csv');
const moment = require('moment');

const fs = require('fs');
const csv = require('csv-parser');
const { Course } = require('../models');

module.exports = {
  up: (queryInterface, Sequelize) =>
    new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          // console.log(data);
          const dateIn = new Date(parseInt(data.dateIn_year), parseInt(data.dateIn_month) - 1, parseInt(data.dateIn_day))
          const dateOut = new Date(parseInt(data.dateOut_year), parseInt(data.dateOut_month) - 1, parseInt(data.dateOut_day))
          const newData = {
            name: data.name,
            dateIn: dateIn,
            dateOut: dateOut,
            correctAnswer: data.correctAnswer,
            AssessmentTypeId: data.assessmentType,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          // console.log(newData);

          results.push(newData);
        })
        .on('end', () => {
          queryInterface
            .bulkInsert('Assessments', results, {})
            .then(() => {
              console.log('Seeds creadas correctamente');
              resolve();
            })
            .catch((error) => {
              console.error('Error al crear las seeds:', error);
              reject();
            });
        });
    }),

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete('Assessments', null, {}),
};
