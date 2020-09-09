let express = require("express");
let app = express();
let ejs = require("ejs");
const mongoose = require("mongoose");
const Author = require("./models/authorModel.js");
const Book = require("./models/bookModel.js");
//ref to body parser
let bodyParser = require("body-parser");

mongoose.connect("mongodb://localhost:27017/libDB", function (err) {
  if (err) {
    console.log("Error in Mongoose connection");
    throw err;
  }
});

//define the rendering engine
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.listen(8080);

//Configure MongoDB
// Connection URL
const url = "mongodb://localhost:27017/libDB";
//reference to the database (i.e. collection)
let db;

// add body-parser as a middleware
// parse application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(express.static("images"));
app.use(express.static("css"));
app.use(express.static("views"));

// parse application/json
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// list books
app.get("/listBooks", function (req, res) {
  Book.find({})
    .populate("authorId")
    .exec(function (err, data) {
      console.log(data);
      res.render("listBooks.html", { db: data });
    });
});

app.get("/listAuthors", function (req, res) {
  Author.find({}).exec(function (err, data) {
    console.log(data);
    res.render("listAuthors.html", { db: data });
  });
});

// add the post request handler
app.post("/newBook", function (req, res) {
  var book1 = new Book({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    isbn: req.body.isbn,
    authorId: req.body.author,
    publicationDate: req.body.publicationDate,
    summary: req.body.summary,
  });

  book1.save(function (err) {
    if (err) res.redirect("/addNewBook.html");
    else {
      console.log("Book1 successfully Added to DB");
      res.redirect("/listBooks");
    }
  });
});

// add the post request handler
app.post("/newAuthor", function (req, res) {
  console.log(req.body.lastName);
  let author1 = new Author({
    _id: new mongoose.Types.ObjectId(),
    name: {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    },
    dob: Date(req.body.dob),
    state: req.body.state,
    suburb: req.body.suburb,
    street: req.body.street,
    unit: req.body.unit,
    numBooks: req.body.numbooks,
  });

  author1.save(function (err) {
    if (err) {
      console.log(err);
      res.redirect("/addNewAuthor.html");
    } else {
      res.redirect("/listAuthors");
      console.log("Author successfully Added to DB");
    }
  });
});

// add the post request handler
app.post("/updateBook", function (req, res) {
  console.log(req.body.books);
  Author.updateOne(
    { _id: req.body.id },
    { $set: { numBooks: req.body.books } },
    { runValidators: true },
    function (err, doc) {
      if (err || req.body.books > 150) {
        console.log(err);
        res.redirect("/updateAuthorBook.html");
      } else {
        console.log(doc);
        res.redirect("/listAuthors");
      }
    }
  );
});

// add the post request handler
app.post("/deleteBook", function (req, res) {
  Book.deleteOne({ isbn: req.body.isbn }, function (err, doc) {
    if (err) res.redirect("/deleteBook.html");
    else {
      console.log(doc);
      res.redirect("/listbooks");
    }
  });
});

// Wildcard for no matches
app.get(/.*/, (req, res) => {
  res.render(__dirname + "/views/invalid.html", {
    data: "Maybe this page moved? Got deleted?",
  });
});
