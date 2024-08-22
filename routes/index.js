const router = require("express").Router();
const { NOT_FOUND } = require("../utils/errors");
const { createUser, loginUser } = require("../controllers/users");

const userRouter = require("./users");
const itemRouter = require("./clothingItems");

router.post("/signin", loginUser);
router.post("/signup", createUser);
router.use("/users", userRouter);
router.use("/items", itemRouter);
router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Resource not found" });
});

module.exports = router;
