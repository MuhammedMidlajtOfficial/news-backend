const { Router } = require('express');
const controller = require('../../Controller/newsController');
const router = Router();

router.get('/', controller.getNews)
router.get('/trending', controller.getTrendingNews)
router.post('/', controller.postNews)
router.patch('/updateLike', controller.updateLike)

module.exports = router;