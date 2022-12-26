const db = require("../models");
const Sequelize = require("sequelize");

const Request = db.request;
const User = db.user;
const Item = db.item;

exports.addRequest= (req, res) => {
  // Save Item to Database
  Request.create({
    userId:req.body.userId,
    itemId:req.body.itemId,
    adminId:req.body.adminId
  })
    .then((item) => {
      res.send({ message: "Item added successfully!", res: item });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message, err: err });
    });
};

exports.getRequests = (req, res) => {

  Request.findAll({
    include: [{ model: Item}],
  })
  .then((item) => res.status(200).send(item))
    .catch((err) => {
      res.status(500).send({ message: err.message, err: err });
    });
};

exports.getRequest = (req, res) => {
Request.findByPk(req.query.id, {
    include: [{ model: User }],
  })
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      res.status(500).send({ message: err.message, err: err });
    });
};
exports.searchItem = async (req, res) => {
  const Op = Sequelize.Op;
  var query = {};

  //1. search, no status
  //2. search, status,
  //3. No search, status,
  //4. No search, no status

  if (req.query.search) {
    if (req.query.status) {
      query = {
        where: {
          companyName: {
            [Op.like]: `%${req.query.search}%`,
          },
          status: req.query.status,
        },
        include: [{ model: User }],
      };
    } else
      query = {
        where: {
          companyName: {
            [Op.like]: `%${req.query.search}%`,
          },
          status: "approved",
        },
        include: [{ model: User }],
      };
  } else {
    if (req.query.status) {
      query = {
        where: {
          status: req.query.status,
        },
        include: [{ model: User }],
      };
    } else
      query = {
        where: {
          status: "approved",
        },
        include: [{ model: User }],
      };
  }
  const items = await Item.findAll(query);
  res.status(200).send(items);
};
exports.updateItem = async (req, res) => {
  const item = await Item.update(req.body.payload, {
    where: {
      id: req.body.id,
    },
  });

  if (item !== 0 && item !== "0") {
    const data = await Item.findByPk(req.body.id, {
      include: [{ model: User }],
    });
    res.status(200).json(data);
  } else res.status(500).json({ error: "Unable to update item." });
};

exports.approvePost = async (req, res) => {
  const item = await Item.update(req.body.payload, {
    where: {
      id: req.body.id,
    },
  });

  if (item !== 0 && item !== "0") {
    const data = await Item.findByPk(req.body.id, {
      include: [{ model: User }],
    });
    //Notifiy usr
    // res.json(data);
    Notification.create({
      title: req.body.payload.title,
      read: req.body.payload.read ? req.body.payload.read : false,
      resourceId: data.id,
      resourceUrl:req.body.payload.resourceUrl,
      description:req.body.payload.description
        ? req.body.payload.description
        : "Description not given",
      notifiedUserId: data.user.id,
    })
      .then((item) => {
        res
          .status(200)
          .json({
            post: data,
            notification: item,
            message: "Notification status changed!",
          })
          .catch((e) => {
            res.status(500).send({ message: er.message, err: e });
          });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message, err: err });
      });
    // res.status(200).json(data);
  } else res.status(500).json({ error: "Unable to update item." });
};

exports.deleteItem = async (req, res) => {
  const item = await Item.destroy({ where: { id: req.query.id } });
  if (item !== 0 && item !== "0") {
    const data = await Item.findAll({ include: [{ model: User }] });
    res.status(200).json(data);
  } else res.status(500).json({ error: "Unable to delete item item." });
};
exports.deleteMyItem = async (req, res) => {
  const item = await Item.destroy({ where: { id: req.query.id } });
  if (item !== 0 && item !== "0") {
    const data = await Item.findAll({
      where: { sellerId: req.query.sellerId },
      include: [{ model: User }],
    });
    res.status(200).json(data);
  } else res.status(500).json({ error: "Unable to delete item." });
};
exports.userShare = async (req, res) => {
  const filter = {
    where: {
      sellerId: req.query.sellerId,
    },
    include: [{ model: User }],
  };
  const items = await Item.findAll(filter);
  res.status(200).send(items);
};
