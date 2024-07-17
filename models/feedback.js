const mongoose = require("mongoose");
const Portfolio_FeedBackMsgSchema = new mongoose.Schema(
  {
    name: String,
    image: Object,
    message: Object,
    user_id: String,
  },
  { timestamps: true }
);

const Portfolio_FeedBackMsg = mongoose.model(
  "Portfolio_FeedBackMsg",
  Portfolio_FeedBackMsgSchema
);
exports.Portfolio_FeedBackMsg = Portfolio_FeedBackMsg;
