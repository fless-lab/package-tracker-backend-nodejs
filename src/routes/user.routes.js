const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const { verifyAccessToken } = require("../../utils/jwt.utils");
const checkAdminRole = require("../middlewares/must-be-admin");

router.use(verifyAccessToken);
router.use(checkAdminRole);

router.post("/", UserController.createUser);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);
router.get("/:id", UserController.getUser);
router.get("/", UserController.getAllUsers);

module.exports = router;
