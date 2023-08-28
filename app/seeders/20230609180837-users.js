'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const password = 'santiago';
    const hashedPassword = await bcrypt.hash(password, 10);
    return queryInterface.bulkInsert('Users', [
      {
        firstName: 'Pedro',
        lastName: 'Ríos',
        email: 'pedro@gmail.com',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: 'Diego',
        lastName: 'Chahuan',
        email: 'diego@gmail.com',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: 'Tomas',
        lastName: 'Lagos',
        email: 'tomas@gmail.com',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: 'Juan',
        lastName: 'Anwandter',
        email: 'juan@gmail.com',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
