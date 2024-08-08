const User = require("../models/user");
const { BAD_REQUEST, DEFAULT, NOT_FOUND } = require("../utils/errors");
const { SUCCESSFUL_REQUEST } = require("../utils/successStatus");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(SUCCESSFUL_REQUEST).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(DEFAULT)
        .send({ message: "An error has occured on the server" });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(SUCCESSFUL_REQUEST).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "err.message" });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occured on the server" });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(SUCCESSFUL_REQUEST).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "err.message" });
      } else if (err.name === "CastError") {
        return res.satus(BAD_REQUEST).send({ message: "err.message" });
      }
      return res
        .status(DEFAULT)
        .send({ messageL: "An error has occured on the server" });
    });
};

module.exports = { getUsers, createUser, getUserById };
