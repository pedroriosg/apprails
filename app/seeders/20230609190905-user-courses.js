const path = require('path');

const filePath = path.join(__dirname, '../csv/user_courses.csv');

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
          const newData = {
            UserId: data.UserId,
            CourseId: data.CourseId,
            role: data.role,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          results.push(newData);
        })
        .on('end', () => {
          queryInterface
            .bulkInsert('UserCourses', results, {})
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
    queryInterface.bulkDelete('UserCourses', null, {}),
};
