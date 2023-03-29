const fs = require("fs");

const getOptions = () => {
  const options = {
    host: process.env.NODE_ENV ? process.env.DIGITALOCEAN_HOST : "localhost",
    user: process.env.NODE_ENV ? process.env.DIGITALOCEAN_USER : "admin",
    password: process.env.NODE_ENV ? process.env.DIGITALOCEAN_PASSWORD : "",
    port: process.env.NODE_ENV ? process.env.DIGITALOCEAN_PORT : 3306,
    database: process.env.NODE_ENV ? process.env.DIGITALOCEAN_DATABASE : "test",
    waitForConnections: true,
    ssl: {
      ca: fs.readFileSync(process.cwd() + "/ca-certificate.crt"),
    },
  };
  return options;
};

module.exports = getOptions;
