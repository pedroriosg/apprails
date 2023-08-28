/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserCourses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
      },
      CourseId: {
        type: Sequelize.INTEGER,
        references: { model: 'Courses', key: 'id' },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      role: {
        type: Sequelize.ENUM('student', 'teacher', 'toutor', 'admin'),
        allowNull: true,
        defaultValue: 'student',
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserCourses');
  },
};
