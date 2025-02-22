const { Router } = require('express');
const controller = require('../../Controller/categoryController');
const router = Router();

router.get('/', controller.getCategory)
router.get('/trending', controller.getTrendingCategories)
router.post('/', controller.postCategory)

module.exports = router;