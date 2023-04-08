const fs = require("fs");

const digitalOcean = {
  host: process.env.DIGITALOCEAN_HOST,
  user: process.env.DIGITALOCEAN_USER,
  password: process.env.DIGITALOCEAN_PASSWORD,
  port: process.env.DIGITALOCEAN_PORT,
  database: process.env.DIGITALOCEAN_DATABASE,
  waitForConnections: true,
  ssl: {
    ca: fs.readFileSync(process.cwd() + "/ca-certificate.crt"),
  },
};

const mysqlOptions = digitalOcean;

module.exports = { mysqlOptions };
