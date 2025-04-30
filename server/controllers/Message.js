const models = require('../models');

const { Message } = models;

const makerPage = (req, res) => res.render('app');

const makeMessage = async (req, res) => {
  if (!req.body.title || !req.body.rating) {
    return res.status(400).json({ error: 'Both fields are required!' });
  }

  const messageData = {
    title: req.body.title,
    rating: req.body.rating,
    content: req.body.content || '',
    owner: req.session.account._id,
  };

  try {
    const newMessage = new Message(messageData);
    await newMessage.save();
    return res
      .status(201)
      .json({
        title: newMessage.title,
        rating: newMessage.rating,
        content: newMessage.content,
      });
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
    const docs = await Message.find(query)
      .select('title rating content')
      .lean()
      .exec();

    return res.json({ messages: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving messages' });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const messageId = req.body.id;
    const deleted = await Message.deleteOne({
      _id: messageId,
      owner: req.session.account._id,
    });

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
