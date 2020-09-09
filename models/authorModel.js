const mongoose = require("mongoose");
let authorSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: String,
  },
  birthDate: Date,
  state: {
    type: String,
    validate: {
      validator: function (state) {
        return state.length === 2 || state.length === 3;
      },
      message: "state should be a 2 or 3 characters",
    },
  },
  suburb: String,
  street: String,
  unit: Number,
  numBooks: {
    type: Number,
    validate: {
      validator: function (books) {
        return books >= 1 || books <= 150;
      },
      message: "book number should be between 1 and 150",
    },
  },
});
module.exports = mongoose.model("Author", authorSchema);
