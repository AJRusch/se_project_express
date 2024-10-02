const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/user");
const BadRequestError = require("../utils/error-constructors/BadRequestError");
const ConflictError = require("../utils/error-constructors/ConflictError");
const NotFoundError = require("../utils/error-constructors/NotFoundError");
const UnauthorizedError = require("../utils/error-constructors/UnauthorizedError");

const { JWT_SECRET } = require("../utils/config");
const { SUCCESSFUL_REQUEST } = require("../utils/successStatus");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email) {
    throw new BadRequestError("Email is required");
  }

  if (!validator.isEmail(email)) {
    throw new BadRequestError("Invalid email format");
  }

  return User.findOne({ email })
    .then((currentUser) => {
      if (currentUser) {
        throw new Error("Email already in use");
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => {
      User.create({ name, avatar, email, password: hash }).then((newUser) => {
        const response = newUser.toObject();
        delete response.password;

        return res.status(SUCCESSFUL_REQUEST).send({ data: response });
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      if (err.message === "Email already in use") {
        return next(
          new ConflictError("An account with this email is currently in use")
        );
      }
      return next(err);
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Invalid email or password");
  }

  if (!validator.isEmail(email)) {
    throw new BadRequestError("Invalid email");
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.send({ token });
    })
    .catch((err) => {
      console.error("Login error:", err.name);
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError("Invalid email or password"));
      }
      return next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("invalid data"));
      }
      return next(err);
    });
};

const updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, avatar: req.body.avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        console.error(err);
        return next(new BadRequestError("Invalid data"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      return next(err);
    });
};

module.exports = { getCurrentUser, createUser, loginUser, updateUser };
