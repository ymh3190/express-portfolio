const { Client } = require("ssh2");

const conn = new Client();
conn
  .on("ready", () => {
    console.log("Client :: ready");
    conn.exec("uptime", (err, stream) => {
      if (err) throw err;
      stream
        .on("close", (code, signal) => {
          console.log(
            "Stream :: close :: code: " + code + ", signal: " + signal
          );
          conn.end();
        })
        .on("data", (data) => {
          console.log("STDOUT: " + data);
        })
        .stderr.on("data", (data) => {
          console.log("STDERR: " + data);
        });
    });
  })
  .connect({
    host: process.env.DROPLETS_HOST,
    username: process.env.DROPLETS_USER,
    password: process.env.DROPLETS_PASSWORD,
  });

module.exports = conn;
