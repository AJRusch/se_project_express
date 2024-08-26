const router = require("express").Router();
const {
  getItems,
  deleteItem,
  createItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");

router.get("/", getItems);
router.use(auth);
router.post("/", createItem);
router.delete("/:itemId", deleteItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
