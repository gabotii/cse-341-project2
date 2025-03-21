const express = require('express');
const router = express.Router();
const swimmingToolsController = require('../controllers/swimmingTools');

router.get('/', swimmingToolsController.getAll);
router.get('/:id', swimmingToolsController.getSingle);
router.post('/', swimmingToolsController.createSwimmingTool);
router.put('/:id', swimmingToolsController.updateSwimmingTool);
router.delete('/:id', swimmingToolsController.deleteSwimmingTool);

module.exports = router;