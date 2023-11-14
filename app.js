const express = require("express");
const rateLimit = require("express-rate-limit"); // Express用のレート制限を有効にするミドルウェアパッケージ
const path = require("path");
const GoogleRecaptcha = require("google-recaptcha");
const recaptcha = new GoogleRecaptcha({ secret: "6LcAhF0lAAAAALXvCkGE9iylWOFu_pjNNJzyh0Dm" });
const PORT = process.env.PORT || 8080;

// Rate limit settings.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

// Express settings.
const app = express();
app.set("view engine", "ejs");
app.use(limiter); // Set rate limiter.
app.use(express.urlencoded({ extended: true }));

// Static resources.
app.use("/resources", express.static(path.join(__dirname, "/resources")));

// Dynamic resources.
app.get("/", (req, res) => {
  res.render("./index.ejs");
});

app.post("/", (req, res) => {
  const recaptchaResponse = req.body["g-recaptcha-response"];
  recaptcha.verify({ response: recaptchaResponse }, err => {
    if(err)
      return res.status(400).json({ error: "Invalid Captcha" });
    else
      res.render("./home.ejs");
  });
});

// Execute application.
app.listen(PORT,_=>{
  console.log(`Application listening at http://127.0.0.1:${PORT}`);
})