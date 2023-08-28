const path = require('path');

const filePath = path.join(__dirname, '../csv/announcements.csv');

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
            title: data.title,
            UserId: data.UserId,
            CourseId: data.CourseId,
            content: data.content,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          results.push(newData);
        })
        .on('end', () => {
          queryInterface
            .bulkInsert('Announcements', results, {})
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
    queryInterface.bulkDelete('Announcements', null, {}),
};
