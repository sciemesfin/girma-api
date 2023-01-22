const db = require("../models");
const Sequelize = require("sequelize");

const Subategory = db.subcategory;
const Category = db.category;

exports.addSubcategory= (req, res) => {
  console.log(req.body)
  // Save Item to Database
  Subategory.create({
    userId:req.body.userId,
    categoryId:req.body.categoryId,
    title:req.body.title,
    description:req.body.description
  })
    .then((item) => {
      res.send({ message: "Subategory added successfully!", res: item });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message, err: err });
    });
};

exports.getSubategories = (req, res) => {

    Subategory.findAll({
    include: [{ model: Category}],
  })
  .then((item) => res.status(200).send(item))
    .catch((err) => {
      res.status(500).send({ message: err.message, err: err });
    });
};

exports.getSubategory = (req, res) => {
Subategory.findByPk(req.query.id, {
    include: [{ model: Category }],
  })
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      res.status(500).send({ message: err.message, err: err });
    });
};

exports.updateSubategory = async (req, res) => {
  const item = await Subategory.update(req.body.payload, {
    where: {
      id: req.body.id,
    },
  });

  if (item !== 0 && item !== "0") {
    const data = await Subategory.findByPk(req.body.id, {
      include: [{ model: Category }],
    });
    res.status(200).json(data);
  } else res.status(500).json({ error: "Unable to update subcategory." });
};


exports.deleteSubategory = async (req, res) => {
  const item = await Category.destroy({ where: { id: req.query.id } });
  if (item !== 0 && item !== "0") {
    const data = await Category.findAll({ include: [{ model: Category }] });
    res.status(200).json(data);
  } else res.status(500).json({ error: "Unable to delete subcategory." });
};

