const router = require("express").Router();
const {
  getItems,
  deleteItem,
  createItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");
const {
  validateCardBody,
  validateClothingId,
} = require("../middlewares/validation");

router.get("/", getItems);
router.use(auth);
router.post("/", validateCardBody, createItem);
router.delete("/:itemId", validateClothingId, deleteItem);
router.put("/:itemId/likes", validateClothingId, likeItem);
router.delete("/:itemId/likes", validateClothingId, dislikeItem);

module.exports = router;
