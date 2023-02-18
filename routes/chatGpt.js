const { Configuration, OpenAIApi } = require("openai");
const conversation = require("../model/conversation");
const Conversation = require("../model/conversation");

const configuration = new Configuration({
  organization: "org-N4JkQzCTQRDo4RKdRxsKisSL",
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

const router = require("express").Router();

router.get("/models", async (req, res) => {
  try {
    const response = await openai.listEngines();
    res.json(response.data.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/conversation/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const conversations = await Conversation.find(
      { userId },
      { firstMessage: 1, userId: 1 }
    );
    res.status(200).json(conversations);
  } catch (error) {}
});

router.get("/message/:chatId", async (req, res) => {
  try {
    const { chatId } = req.params;
    const conversations = await Conversation.findOne({ _id: chatId });
    res.status(200).json(conversations?.messages ?? []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/message", async (req, res) => {
  try {
    const { model, prompt, chatId, userId } = req.body;

    const response = await openai.createCompletion({
      model,
      prompt,
      max_tokens: 100,
      stop: ["\n"],
    });

    const text = response.data.choices[0].text;

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

module.exports = router;
