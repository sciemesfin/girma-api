const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: false,

  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.item = require("../models/item.model.js")(sequelize, Sequelize);
db.request = require("../models/request.model")(sequelize, Sequelize);
db.category = require("../models/category.model.js")(sequelize, Sequelize);
db.subcategory = require("../models/subcategory.model.js")(
  sequelize,
  Sequelize
);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
});

db.item.belongsTo(db.user, {
  foreignKey: "userId",
});
db.user.hasMany(db.item, {
  foreignKey: "userId",
});

db.request.belongsTo(db.user, {
  foreignKey: "userId",
});
db.user.hasMany(db.request, {
  foreignKey: "userId",
});

db.request.belongsTo(db.user, {
  foreignKey: "adminId",
});
db.user.hasMany(db.request, {
  foreignKey: "adminId",
});

db.request.belongsTo(db.item, {
  foreignKey: "itemId",
});
db.item.hasMany(db.request, {
  foreignKey: "itemId",
});

//category
db.category.belongsTo(db.user, {
  foreignKey: "userId",
});
db.user.hasMany(db.category, {
  foreignKey: "userId",
});

//subcategory
db.subcategory.belongsTo(db.category, {
  foreignKey: "categoryId",
});
db.category.hasMany(db.subcategory, {
  foreignKey: "categoryId",
});

//item-category
db.item.belongsTo(db.category, {
  foreignKey: "categoryId",
});
db.category.hasMany(db.item, {
  foreignKey: "categoryId",
});
//item-subcategory
db.item.belongsTo(db.subcategory, {
  foreignKey: "subcategoryId",
});
db.subcategory.hasMany(db.item, {
  foreignKey: "subcategoryId",
});

db.ROLES = ["user", "admin","staff"];

module.exports = db;
