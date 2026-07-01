const ChatMessageModel = require("../models/chat.model");

const getConversationsController = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await ChatMessageModel.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ["$sender", userId] }, "$receiver", "$sender"],
          },
          lastMessage: { $first: "$text" },
          lastMessageAt: { $first: "$createdAt" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$receiver", userId] },
                    { $eq: ["$read", false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          participant: {
            $first: {
              $cond: [{ $eq: ["$sender", userId] }, "$receiver", "$sender"],
            },
          },
        },
      },
    ]);

    const populated = await ChatMessageModel.populate(conversations, {
      path: "participant",
      select: "name email",
    });

    res.status(200).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMessagesController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatUserId } = req.params;

    const messages = await ChatMessageModel.find({
      $or: [
        { sender: userId, receiver: chatUserId },
        { sender: chatUserId, receiver: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name email")
      .populate("receiver", "name email");

    await ChatMessageModel.updateMany(
      {
        sender: chatUserId,
        receiver: userId,
        read: false,
      },
      { $set: { read: true } },
    );

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getConversationsController,
  getMessagesController,
};
