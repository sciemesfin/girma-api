module.exports = (sequelize, Sequelize) => {
  const Item = sequelize.define("requests", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: Sequelize.UUID,
    },
    itemId: {
      type: Sequelize.UUID,
    },
    adminId: {
      type: Sequelize.UUID,
    },
    description: {
      type: Sequelize.STRING,
    },
  });

  return Item;
};
