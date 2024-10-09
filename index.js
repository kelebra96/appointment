const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");
const app = express();

dotenv.config();
const port = process.env.PORT || 3000;

// Set view engine
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Configurar express-session
app.use(
  session({
    secret: "seuSegredoSeguro", // Use uma string secreta em produção
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

// Middleware para tornar mensagens flash disponíveis em todas as visualizações
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

// Database connection
const db = require("./src/data/db");
db();

// Middleware to block robots.txt
app.use((req, res, next) => {
  if (req.url === "/robots.txt") {
    res.status(404).send("Not Found");
  } else {
    next();
  }
});

// Routes
const indexRoute = require("./src/route/indexRoute");
app.use("/", indexRoute);

// Web server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
