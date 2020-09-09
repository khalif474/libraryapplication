const mongoose = require("mongoose");
let bookSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: true,
  },
  isbn: Number,
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
  },
  publicationDate: {
    type: Date,
    default: Date.now,
  },
  summary: String,
});

// Pre hook for `findOneAndUpdate`
bookSchema.pre("updateOne", function (next) {
  this.options.runValidators = true;
  next();
});
module.exports = mongoose.model("Book", bookSchema);
