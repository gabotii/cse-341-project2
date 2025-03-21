const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

// Validation function for email format
const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};

const getAll = async (req, res) => {
  //#swagger.tags=['Clients']
  try {
    const result = await mongodb.getDatabase().db().collection('clients').find();
    const clients = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Error occurred while retrieving clients.', error });
  }
};

const getSingle = async (req, res) => {
  //#swagger.tags=['Clients']
  const clientId = req.params.id;

  // Check if the ID is valid
  if (!ObjectId.isValid(clientId)) {
    return res.status(400).json({ message: 'Invalid client ID format.' });
  }

  try {
    const result = await mongodb.getDatabase().db().collection('clients').find({ _id: new ObjectId(clientId) });
    const clients = await result.toArray();

    if (clients.length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(clients[0]);
    } else {
      res.status(404).json({ message: 'Client not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error occurred while retrieving the client.', error });
  }
};

const createClient = async (req, res) => {
  //#swagger.tags=['Clients']
  const { name, email, company } = req.body;

  // Check if the required fields are provided
  if (!name || !email || !company) {
    return res.status(400).json({ message: 'Missing required fields: name, email, or company.' });
  }

  // Validate email format
  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  const client = {
    name,
    email,
    company
  };

  try {
    const response = await mongodb.getDatabase().db().collection('clients').insertOne(client);
    if (response.acknowledged) {
      res.status(201).send(); // 201 for creation
    } else {
      res.status(500).json({ message: 'Error occurred while creating the client.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error occurred while creating the client.', error });
  }
};

const updateClient = async (req, res) => {
  //#swagger.tags=['Clients']
  const clientId = req.params.id;

  // Check if the ID is valid
  if (!ObjectId.isValid(clientId)) {
    return res.status(400).json({ message: 'Invalid client ID format.' });
  }

  const { name, email, company, ipaddress } = req.body;

  // Check if the required fields are provided
  if (!name || !email || !company) {
    return res.status(400).json({ message: 'Missing required fields: name, email, or company.' });
  }

  // Validate email format
  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  const client = {
    name,
    email,
    company,
    ipaddress
  };

  try {
    const response = await mongodb
      .getDatabase()
      .db()
      .collection('clients')
      .replaceOne({ _id: new ObjectId(clientId) }, client);

    if (response.modifiedCount > 0) {
      res.status(204).send(); // No content
    } else {
      res.status(404).json({ message: 'Client not found or data not modified.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error occurred while updating the client.', error });
  }
};

const deleteClient = async (req, res) => {
  //#swagger.tags=['Clients']
  const clientId = req.params.id;

  // Check if the ID is valid
  if (!ObjectId.isValid(clientId)) {
    return res.status(400).json({ message: 'Invalid client ID format.' });
  }

  try {
    const response = await mongodb
      .getDatabase()
      .db()
      .collection('clients')
      .deleteOne({ _id: new ObjectId(clientId) });

    if (response.deletedCount > 0) {
      res.status(204).send(); // No content
    } else {
      res.status(404).json({ message: 'Client not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error occurred while deleting the client.', error });
  }
};

module.exports = {
  getAll,
  getSingle,
  createClient,
  updateClient,
  deleteClient
};
