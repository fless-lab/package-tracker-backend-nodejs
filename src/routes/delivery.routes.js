const express = require('express');
const router = express.Router();
const DeliveryController = require('../controllers/delivery.controller');
const authorizeUser = require('../middlewares/authoroized-user');
const { verifyAccessToken } = require('../../utils/jwt.utils');

router.use(verifyAccessToken);

router.post('/', authorizeUser(['admin']), DeliveryController.createDelivery);
router.get('/:id', DeliveryController.getDelivery);
router.get('/', DeliveryController.getAllDeliveries);
router.put('/:id', authorizeUser(['admin', 'driver']), DeliveryController.updateDelivery);
router.delete('/:id', authorizeUser(['admin']), DeliveryController.deleteDelivery);

module.exports = router;
