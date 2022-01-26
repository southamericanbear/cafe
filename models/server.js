const express = require("express");
const cors = require("cors");
const dbConnection = require("../db/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.paths = {
      user: "/api/users",
      auth: "/api/auth",
      category: "/api/category",
      products: "/api/products",
    };

    this.connectDB();
    this.middlewares();

    this.routes();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static("public"));
  }

  async connectDB() {
    await dbConnection();
  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.user, require("../routes/user"));
    this.app.use(this.paths.category, require("../routes/category"));
    this.app.use(this.paths.products, require("../routes/products"));
  }

  listen() {
    this.app.listen(this.port, () =>
      console.log(`Listening on port: ${this.port}`)
    );
  }
}

module.exports = Server;
