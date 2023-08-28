const path = require('path');

const filePath = path.join(__dirname, '../csv/courses.csv');

const fs = require('fs');
const csv = require('csv-parser');
const { COurse } = require('../models');

module.exports = {
  up: (queryInterface, Sequelize) =>
    new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          const newData = {
            name: data.name,
            driveUrl: data.driveUrl,
            calendarUrl: data.calendarUrl,
            GradeId: data.GradeId,
            SubjectId: data.SubjectId,
            SchoolId: data.SchoolId,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          results.push(newData);
        })
        .on('end', () => {
          queryInterface
            .bulkInsert('Courses', results, {})
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
    queryInterface.bulkDelete('Courses', null, {}),
};
