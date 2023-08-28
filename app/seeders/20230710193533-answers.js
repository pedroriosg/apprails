const path = require('path');

const filePath = path.join(__dirname, '../csv/answers.csv');

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
            answer: data.answer,
            score: data.score,
            total: data.total,
            UserId: data.UserId,
            AssessmentId: data.AssessmentId,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          results.push(newData);
        })
        .on('end', () => {
          queryInterface
            .bulkInsert('Answers', results, {})
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
    queryInterface.bulkDelete('Answers', null, {}),
};
