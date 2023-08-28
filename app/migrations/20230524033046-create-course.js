/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Courses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      driveUrl: {
        type: Sequelize.TEXT,
      },
      calendarUrl: {
        type: Sequelize.TEXT,
      },
      SchoolId: {
        type: Sequelize.INTEGER,
        references: { model: 'Schools', key: 'id' },
      },
      SubjectId: {
        type: Sequelize.INTEGER,
        references: { model: 'Subjects', key: 'id' },
      },
      GradeId: {
        type: Sequelize.INTEGER,
        references: {model: 'Grades', key: 'id'}
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Courses');
  },
};
