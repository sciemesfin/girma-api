const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    phone: req.body.phone,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    idNumber: req.body.idNumber,
    address: req.body.address,
    avatar: req.body.avatar,
    displayName: req.body.displayName
  })
    .then((user) => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            var token = jwt.sign({ id: user.id }, config.secret, {
              expiresIn: 86400, // 24 hours
              // expiresIn: 120,
            });

            var authorities = [];
            user.getRoles().then((roles) => {
              for (let i = 0; i < roles.length; i++) {
                authorities.push("ROLE_" + roles[i].name.toUpperCase());
              }
              // console.log("user: ", user);
              res.status(200).send({
                // ...user,
                id: user.id,
                username: user.username,
                email: user.email,
                roles: authorities,
                accessToken: token,
                firstName: user.firstName,
                lastName: user.lastName,
                gender: user.gender,
                phone: user.phone,
                address: user.address,
                idNumber: user.idNumber,
                avatar: user.avatar,
                displayName: user.displayName,
                message: "User registered successfully!",
              });
            });

            // res.send({ message: "User registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          var token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400, // 24 hours
            // expiresIn: 120,
          });

          var authorities = [];
          user.getRoles().then((roles) => {
            for (let i = 0; i < roles.length; i++) {
              authorities.push("ROLE_" + roles[i].name.toUpperCase());
            }
            // console.log("user: ", user);
            res.status(200).send({
              id: user.id,
              username: user.username,
              email: user.email,
              roles: authorities,
              accessToken: token,
              firstName: user.firstName,
              lastName: user.lastName,
              gender: user.gender,
              phone: user.phone,
              address: user.address,
              idNumber: user.idNumber,
              avatar: user.avatar,
              displayName: user.displayName,
              message: "User registered successfully!",
            });
          });

          // res.send({ message: "User registered successfully!" });
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({where: {email: req.body.email } },{include: [{ model: Role }],})
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
        // expiresIn: 120,
      });

      var authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        // console.log("user: ", user);
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
          firstName: user.firstName,
          lastName: user.lastName,
          gender: user.gender,
          phone: user.phone,
          address: user.address,
          idNumber: user.idNumber,
          avatar: user.avatar,
          displayName: user.displayName,
          message: "User registered successfully!",
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.updateUser = (req, res) => {
  User.update(req.body.payload, {
    where: {
      id: req.body.id,
    },
  })
    .then(() => {
      User.findByPk(req.body.id)
        .then((user) => res.status(200).json(user))
        .catch((e) => res.status(500).json(e));
    })
    .catch((err) => res.status(500).json(err));
};
exports.getUsers = (req, res) => {
  User.findAll({include: [{ model: Role }],})
    .then((users) => {
      res.status(200).json(users)
    })
    .catch((err) => res.status(500).json(err));
};
exports.updatePassword = (req, res) => {
  const payload = {
    ...req.body.payload,
    password: bcrypt.hashSync(req.body.payload.password, 8),
  };
  User.update(payload, {
    where: {
      id: req.body.id,
    },
  })
    .then(() => {
      User.findByPk(req.body.id)
        .then((user) => res.status(200).json(user))
        .catch((e) => res.status(500).json(e));
    })
    .catch((err) => res.status(500).json(err));
};

exports.getUser = async (req, res) => {
  User.findByPk(req.query.id,{include: [{ model: Role }],})
    .then((user) => res.status(200).json(user))
    .catch((e) => res.status(500).json(e));
};

exports.deleteUser = async (req, res) => {
  const user = await User.destroy({ where: { id: req.query.id } });
  if (user !== 0 && user !== "0") {
    const data = await User.findAll();
    res.status(200).json(data);
  } else res.status(500).json({ error: "Unable to delete user." });
};