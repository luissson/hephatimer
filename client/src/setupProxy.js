const proxy = require("http-proxy-middleware");

module.exports = app => {
  app.use(proxy("/api/*", { target: "https://hephatimer-database.herokuapp.com/" , changeOrigin:true}));
};
