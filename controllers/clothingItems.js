const ClothingItem = require("../models/clothingItem");
const { BAD_REQUEST, DEFAULT, NOT_FOUND } = require("../utils/errors");
const { SUCCESSFUL_REQUEST } = require("../utils/successStatus");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(SUCCESSFUL_REQUEST).send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(DEFAULT)
        .send({ message: "An error has occured on the server" });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then({ data: item })
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

const deleteItem = (req, res) => {
  const { itemId } = req.body;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.send({ item }))
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

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send({ item }))
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

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send({ item }))
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

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
