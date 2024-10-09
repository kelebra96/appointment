


const home = (req, res) => {
  res.render("index/home");
};
const create = (req, res) => {
    res.render("index/create");
}
const index = (req, res) => {
  res.render("index/calendar");
};
const service = (req, res) => {
    res.render("index/service");
}
const appointment = (req, res) => {
    res.render("index/appointment");
}

module.exports = { home,index, create, service, appointment };