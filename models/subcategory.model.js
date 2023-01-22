module.exports = (sequelize, Sequelize) => {
  const Item = sequelize.define("subcategories", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: Sequelize.UUID,
    },
    categoryId: {
      type: Sequelize.UUID,
    },
    title: {
      type: Sequelize.UUID,
    },
    description: {
      type: Sequelize.STRING,
    },
  });

  return Item;
};
