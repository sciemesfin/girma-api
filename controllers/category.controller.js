const db = require("../models");
const Sequelize = require("sequelize");

const Category = db.category;
const User = db.user;
const Item = db.item;

exports.addCategory= (req, res) => {
  // Save Item to Database
  Category.create({
    userId:req.body.userId,
    title:req.body.title,
    description:req.body.description
  })
    .then((item) => {
      res.send({ message: "Category added successfully!", res: item });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message, err: err });
    });
};

exports.getCategories = (req, res) => {

  Category.findAll({
    include: [{ model: User}],
  })
  .then((item) => res.status(200).send(item))
    .catch((err) => {
      res.status(500).send({ message: err.message, err: err });
    });
};

exports.getCategory = (req, res) => {
Category.findByPk(req.query.id, {
    include: [{ model: User }],
  })
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      res.status(500).send({ message: err.message, err: err });
    });
};

exports.updateCategory = async (req, res) => {
  const item = await Category.update(req.body.payload, {
    where: {
      id: req.body.id,
    },
  });

  if (item !== 0 && item !== "0") {
    const data = await Category.findByPk(req.body.id, {
      include: [{ model: User }],
    });
    res.status(200).json(data);
  } else res.status(500).json({ error: "Unable to update category." });
};


exports.deleteCategory = async (req, res) => {
  const item = await Category.destroy({ where: { id: req.query.id } });
  if (item !== 0 && item !== "0") {
    const data = await Category.findAll({ include: [{ model: User }] });
    res.status(200).json(data);
  } else res.status(500).json({ error: "Unable to delete category." });
};

