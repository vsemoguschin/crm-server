// migrations/XXXXXXXXXXXXXX-add-managersPlanId-to-deals.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('deals', 'managersPlanId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'managersPlans',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('deals', 'managersPlanId');
  },
};
