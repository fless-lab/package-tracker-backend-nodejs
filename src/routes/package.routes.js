const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require("../../utils/jwt.utils");
const PackageController = require('../controllers/package.controller');
const authorizeUser = require('../middlewares/authoroized-user');


router.use(verifyAccessToken);
router.use(authorizeUser(["admin","customer"]));

// Routes
router.post('/', PackageController.createPackage);
router.get('/:id', PackageController.getPackage);
router.get('/', PackageController.getAllPackages);
router.put('/:id', PackageController.updatePackage);
router.delete('/:id', PackageController.deletePackage);

module.exports = router;
