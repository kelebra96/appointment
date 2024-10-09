const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.cookies ? req.cookies.token : null; // Garantir que os cookies existam

  if (!token) {
    // Redireciona para a página inicial se não houver token
    return res.status(401).redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Anexa as informações do usuário à solicitação
    next();
  } catch (error) {
    // Redireciona para a página inicial se o token for inválido ou expirado
    return res.status(401).redirect("/login");
  }
};

module.exports = auth;
