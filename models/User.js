module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define(
        'Users',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userName: {
                type: DataTypes.STRING(255),
                unique: true,
            },
            password: {
                type: DataTypes.STRING(255),
            },
            accessToken: {
                type: DataTypes.STRING(255),
            },
            login: {
                type: DataTypes.DATE,
            },
            logout: {
                type: DataTypes.DATE,
            }
        },
        {
            timestamps: false,
            tableName: 'users',
        }
    );
    return Users;
}