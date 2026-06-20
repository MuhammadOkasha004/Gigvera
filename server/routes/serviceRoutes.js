const express = require('express');
const router = express.Router();
const { getAllServices, getCategories, getServiceById } = require('../controllers/serviceController');

router.get('/', getAllServices);
router.get('/categories', getCategories);
router.get('/:id', getServiceById);

module.exports = router;
