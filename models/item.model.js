module.exports = (sequelize, Sequelize) => {
  const Item = sequelize.define("items", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    imageUrl: {
      type: Sequelize.STRING,
    },
    itemName: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    modelName: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    inventoryCode: {
      type: Sequelize.STRING,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    quantity: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    cost: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: "pending",
      allowNull: true,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    userId: {
      type: Sequelize.UUID,
    },
  });

  return Item;
};
