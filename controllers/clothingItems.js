const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  DEFAULT,
  NOT_FOUND,
  FORBIDDEN,
} = require("../utils/errors");
const BadRequestError = require("../utils/error-constructors/BadRequestError");
const ConflictError = require("../utils/error-constructors/ConflictError");
const NotFoundError = require("../utils/error-constructors/NotFoundError");
const UnauthorizedError = require("../utils/error-constructors/UnauthorizedError");
const ForbiddenError = require("../utils/error-constructors/ForbiddenError");
const { SUCCESSFUL_REQUEST } = require("../utils/successStatus");

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(SUCCESSFUL_REQUEST).send(items))
    .catch(next);
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      } else {
        next(err);
      }
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== userId) {
        throw new ForbiddenError("You are not authorized to delete this form");
      }
      return ClothingItem.findByIdAndDelete(itemId);
    })
    .then((item) => res.send({ item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "Access Denied") {
        return next(
          new ForbiddenError("You are not authorized to delete this form")
        );
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      } else {
        next(err);
      }
    });
};

const likeItem = (req, res, next) => {
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
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid Item ID"));
      } else {
        next(err);
      }
    });
};

const dislikeItem = (req, res, next) => {
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
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      } else {
        next(err);
      }
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
