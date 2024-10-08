const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");
const { validateUpdateUserInfo } = require("../middlewares/validation");
const auth = require("../middlewares/auth");

router.use(auth);

router.get("/me", getCurrentUser);

router.patch("/me", validateUpdateUserInfo, updateUser);

module.exports = router;
