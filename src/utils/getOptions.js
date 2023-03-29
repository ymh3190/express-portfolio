const fs = require("fs");

const getOptions = () => {
  const options = process.env.NODE_ENV
    ? {
        host: process.env.DIGITALOCEAN_HOST,
        user: process.env.DIGITALOCEAN_USER,
        password: process.env.DIGITALOCEAN_PASSWORD,
        port: process.env.DIGITALOCEAN_PORT,
        database: process.env.DIGITALOCEAN_DATABASE,
        waitForConnections: true,
        ssl: {
          ca: fs.readFileSync(process.cwd() + "/ca-certificate.crt"),
        },
      }
    : {
        host: "localhost",
        user: "admin",
        database: "test",
        waitForConnections: true,
      };
  return options;
};

module.exports = getOptions;
