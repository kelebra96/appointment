const express = require("express");
const router = express.Router();
const indexController = require("../controller/indexController");
const authController = require("../controller/authController");
const authMiddleware = require("../middleware/authMiddleware");
const appointmentService = require("../services/AppointmentService");

router.get("/", indexController.home);
router.get("/createcalendar", authMiddleware, indexController.index);
router.get("/create", authMiddleware, indexController.create);
router.get("/appointment", authMiddleware, indexController.appointment);
router.get("/service", authMiddleware, indexController.service);
router.post("/create", async (req, res) => {
  var status = await appointmentService.Create(
    req.body.name,
    req.body.email,
    req.body.phone,
    req.body.cpf,
    req.body.description,
    req.body.date,
    req.body.time
  );
  if (status) {
    res.redirect("/createcalendar");
  } else {
    res.send("Error on create appointment");
  }
});
router.get("/getcalendar", async (req, res) => {
  var appointments = await appointmentService.GetAll(false);
  res.json(appointments);
});
router.get("/finish/:id", authMiddleware,async (req, res) => {
  var appointment = await appointmentService.GetAll(req.params.id);
  console.log(appointment);
  res.render("index/event", { appointment });
});
router.post("/finish", async (req, res) => {
  var id = req.body.id;
  // Adicionando uma verificação para logar o ID recebido
  if (!id) {
    console.error("Nenhum ID foi fornecido.");
    return res.status(400).send("Nenhum ID foi fornecido.");
  }
  var result = await appointmentService.Finish(id);
  if (result) {
    res.redirect("/createcalendar");
  } else {
    res.send("Error on finish appointment");
  }
});
router.get("/list", authMiddleware, async (req, res) => {
  var appointments = await appointmentService.GetAll(true);
  res.render("index/list", { appointments });
});
router.get("/search", authMiddleware, async (req, res) => {
  try {
    var appointments = await appointmentService.Search(req.query.search);
  res.render("index/list", { appointments });
  } catch (error) {
    console.log(error);
    res.redirect("/list");
  }
});
// Authentication Routes
router.get("/login", (req, res) => {
  console.log(req.flash("error_msg")); // Exibe no console as mensagens armazenadas com a chave 'error_msg'
  res.render("auth/login");
});
router.get("/register", (req, res) => res.render("auth/register"));
router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/logout", authController.logout);


module.exports = router;
