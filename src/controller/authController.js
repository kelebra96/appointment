const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// User registration
const register = async (req, res) => {
  console.log(req.body);
  try {
    const { name, email, phone, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      req.flash("error_msg", "E-mail já registrado. Por favor, faça login.");
      return res.redirect("/login")
    }
    user = new User({ name, email, phone, password });
    await user.save();
    req.flash("success_msg", "Usuário registrado com sucesso!");
    res.redirect("/login");
  } catch (error) {
    console.error("Error during registration", error);
    req.flash("error_msg", "Erro no servidor. Tente novamente.");
    res.redirect("/register");
  }
};

// User login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.flash(
        "error_msg",
        "Credenciais inválidas. Verifique seu e-mail e senha."
      );
      return res.redirect("/login");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash(
        "error_msg",
        "Credenciais inválidas. Verifique seu e-mail e senha."
      );
      return res.redirect("/login");
    }

    // Gerar JWT token
    const token = jwt.sign(
      { userId: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    res.cookie("token", token, { httpOnly: true });
    req.flash("success_msg", "Login realizado com sucesso!");
    res.redirect("/appointment");
  } catch (error) {
    console.error("Erro durante o login", error);
    req.flash("error_msg", "Ocorreu um erro no servidor. Tente novamente.");
    res.redirect("/login");
  }
};


// User logout
const logout = (req, res) => {
  // Clear the token from cookies to log the user out
  res.clearCookie("token");
  res.redirect("/login");
};

// Export all functions
module.exports = { register, login, logout };
