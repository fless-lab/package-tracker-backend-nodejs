const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const { verifyAccessToken } = require("../../utils/jwt.utils");
const authorizeUser = require("../middlewares/authoroized-user");

router.use(verifyAccessToken);
router.use(authorizeUser(["admin"]));

router.post("/", UserController.createUser);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);
router.get("/:id", UserController.getUser);
router.get("/", UserController.getAllUsers);

module.exports = router;
