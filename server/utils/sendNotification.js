const Notification = require('../models/Notification');

const sendNotification = async (userId, title, message, type = 'General') => {
  try {
    await Notification.create({
      userId,
      title,
      message,
      type,
    });
  } catch (error) {
    console.error('Notification error:', error.message);
  }
};

module.exports = sendNotification;
