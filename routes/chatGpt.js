const { Configuration, OpenAIApi } = require("openai");
const { key } = require("../config");
const authenticateToken = require("../middleware/is-auth");
const Conversation = require("../model/conversation");

const configuration = new Configuration({
  organization: "org-N4JkQzCTQRDo4RKdRxsKisSL",
  apiKey: key,
});

const openai = new OpenAIApi(configuration);

const router = require("express").Router();

router.get("/models", authenticateToken, async (req, res) => {
  try {
    const response = await openai.listEngines();
    res.json(response.data.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/conversation/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const conversations = await Conversation.find(
      { userId },
      { firstMessage: 1, userId: 1 }
    );
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/message/:chatId", authenticateToken, async (req, res) => {
  try {
    const { chatId } = req.params;
    const conversations = await Conversation.findOne({ _id: chatId });
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/message", authenticateToken, async (req, res) => {
  try {
    const { model, prompt, chatId, userId, temperature } = req.body;

    const response = await openai.createCompletion({
      model,
      prompt,
      temperature: Number(temperature),
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    const text = response.data.choices[0].text.trimLeft();

    if (chatId) {
      const messages = [
        {
          sender: "user",
          message: prompt,
        },
        {
          sender: "gpt",
          message: text,
        },
      ];
      const conversation = await Conversation.findOneAndUpdate(
        { _id: chatId },
        {
          $push: { messages: { $each: messages } },
        },
        { new: true }
      );
      const newMessage =
        conversation.messages[conversation.messages.length - 1];
      res.json({ _id: conversation._id, newMessage });
    } else {
      const conversation = new Conversation({
        firstMessage: text,
        userId,
        messages: [
          {
            sender: "user",
            message: prompt,
          },
          {
            sender: "gpt",
            message: text,
          },
        ],
      });
      await conversation.save();
      res.json(conversation);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/conversation/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params || {};
    await Conversation.deleteOne({ _id: id });
    res.status(200).json({ message: "delete successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("like/:conversationId", authenticateToken, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findOneAndUpdate(
      { _id: conversationId },
      { $set: { islike } }
    );
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/clear/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    await Conversation.deleteMany({ userId });
    res.status(200).json({ message: "clear conversation successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
