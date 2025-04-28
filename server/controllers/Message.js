const models = require('../models');

const { message } = models;

const makerPage = (req, res) => res.render('app');

const makeMessage = async (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'Both fields are required!' });
  }

  const messageData = {
    name: req.body.name,
    age: req.body.age,
    favFood: req.body.favFood || '',
    owner: req.session.account._id,
  };

  try {
    const newMessage = new Message(messageData);
    await newMessage.save();
    return res.status(201).json({ name: newMessage.name, age: newMessage.age, favFood: newMessage.favFood });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Message already exists!' });
    }
    return res.status(500).json({ error: 'An error occurred' });
  }
};

const getMessages = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Message.find(query).select('name age favFood').lean().exec();

    return res.json({ messages: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving messages' });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const messageId = req.body.id;
    const deleted = await Message.deleteOne({ _id: messageId, owner: req.session.account._id });

    if (deleted.deletedCount === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    return res.status(200).json({ message: 'Message deleted successfully' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Failed to delete Message' });
  }
};

module.exports = {
  makerPage,
  makeMessage,
  getMessages,
  deleteMessage,
};
