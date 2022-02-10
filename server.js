const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl");
// const fs = require("fs");
const app = express();

// const myCSS = {
//   style: fs.readFileSync("./public/assets/styles.scss", "utf8"),
// };

mongoose.connect("mongodb://localhost/urlShortener", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});

app.post("/shortUrls", async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });

  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });

  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
});

app.get("/", function (req, res) {
  res.render("index.ejs", {
    title: "My Site",
    myCSS: myCSS,
  });
});

app.listen(process.env.PORT || 5000);
