module.exports = (sequelize, DataTypes) => {
    const Bill = sequelize.define(
      "Bill",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        uuid: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              notEmpty: true,
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        contactNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        paymentMethod: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        total: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
              },
        },
        productDetails: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        createdBy: {
            type: DataTypes.STRING,
            allowNull: false,
        },
      },
      {
        timestamps: false,
        tableName: "Bill",
      }
    );
  
    return Bill;
  };
  