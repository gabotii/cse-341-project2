const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  //#swagger.tags=['Swimming Tools']
  const result = await mongodb.getDatabase().db().collection('swimmingTools').find();
  result.toArray().then((tools) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(tools);
  });
};

const getSingle = async (req, res) => {
  //#swagger.tags=['Swimming Tools']
  const toolId = new ObjectId(req.params.id);
  const result = await mongodb.getDatabase().db().collection('swimmingTools').find({ _id: toolId });
  result.toArray().then((tools) => {
    if (tools.length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(tools[0]);
    } else {
      res.status(404).json({ message: 'Swimming tool not found' });
    }
  });
};

const createSwimmingTool = async (req, res) => {
  //#swagger.tags=['Swimming Tools']
  
  const { productName, price } = req.body;

  // Validate input data
  if (!productName || !price) {
    return res.status(400).json({ message: 'Missing required fields: productName or price.' });
  }
  
  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ message: 'Price must be a positive number.' });
  }

  const tool = {
    productName,
    price
  };

  const response = await mongodb
    .getDatabase()
    .db()
    .collection('swimmingTools')
    .insertOne(tool);

  if (response.acknowledged) {
    res.status(201).send(); // 201 for creation
  } else {
    res.status(500).json(response.error || 'Error occurred while creating the swimming tool.');
  }
};

const updateSwimmingTool = async (req, res) => {
  //#swagger.tags=['Swimming Tools']
  const toolId = req.params.id;

  // Validate ID format
  if (!ObjectId.isValid(toolId)) {
    return res.status(400).json({ message: 'Invalid tool ID format.' });
  }

  const { productName, price } = req.body;

  // Validate input data
  if (!productName || !price) {
    return res.status(400).json({ message: 'Missing required fields: productName or price.' });
  }
  
  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ message: 'Price must be a positive number.' });
  }

  const tool = {
    productName,
    price
  };

  try {
    const response = await mongodb
      .getDatabase()
      .db()
      .collection('swimmingTools')
      .replaceOne({ _id: new ObjectId(toolId) }, tool);

    if (response.modifiedCount > 0) {
      res.status(204).send(); // No content
    } else {
      res.status(404).json({ message: 'Swimming tool not found or data not modified.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error occurred while updating the swimming tool.', error });
  }
};

const deleteSwimmingTool = async (req, res) => {
  //#swagger.tags=['Swimming Tools']
  const toolId = new ObjectId(req.params.id);

  const response = await mongodb
    .getDatabase()
    .db()
    .collection('swimmingTools')
    .deleteOne({ _id: toolId });

  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Error occurred while deleting the swimming tool.');
  }
};

module.exports = {
  getAll,
  getSingle,
  createSwimmingTool,
  updateSwimmingTool,
  deleteSwimmingTool
};
