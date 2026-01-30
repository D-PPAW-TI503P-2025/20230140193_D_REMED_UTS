'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Books', 'initialStock', {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            after: 'author'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Books', 'initialStock');
    }
};
