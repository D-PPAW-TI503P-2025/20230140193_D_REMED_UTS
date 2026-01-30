module.exports = (sequelize, DataTypes) => {
    const Book = sequelize.define('Book', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Title cannot be empty' },
            },
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Author cannot be empty' },
            },
        },
        initialStock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    }, {
        timestamps: true,
    });

    Book.associate = (models) => {
        Book.hasMany(models.BorrowLog, { foreignKey: 'bookId' });
    };

    return Book;
};


