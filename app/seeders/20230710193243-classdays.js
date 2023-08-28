const path = require('path');
const filePath = path.join(__dirname, '../csv/classdays.csv');
const moment = require('moment');

const fs = require('fs');
const csv = require('csv-parser');

module.exports = {
  up: (queryInterface, Sequelize) =>
    new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          const date = new Date(parseInt(data.year), parseInt(data.month) - 1, parseInt(data.day))
          const dateOnly = date.toISOString().split('T')[0];         
          const newData = {
            date: dateOnly,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          results.push(newData);
        })
        .on('end', () => {
          queryInterface
            .bulkInsert('Classdays', results, {})
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
    queryInterface.bulkDelete('Classdays', null, {}),
};
