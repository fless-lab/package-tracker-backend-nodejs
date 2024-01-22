const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const { verifyAccessToken } = require("../../utils/jwt.utils");
const authorizeUser = require("../middlewares/authoroized-user");
const { USER_TYPES } = require("../../constants");

router.use(verifyAccessToken);
// router.use(authorizeUser(["admin"]));

router.post("/",authorizeUser(["admin"]), UserController.createUser);
router.put("/:id",authorizeUser(["admin"]), UserController.updateUser);
router.delete("/:id",authorizeUser(["admin"]), UserController.deleteUser);
router.get("/:id",authorizeUser(Object.values(USER_TYPES)), UserController.getUser);
router.get("/",authorizeUser(["admin"]), UserController.getAllUsers);

module.exports = router;
