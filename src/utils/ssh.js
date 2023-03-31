const { readFileSync } = require("fs");
const { Client } = require("ssh2");

const ssh = new Client();
ssh
  .on("ready", () => {
    console.log("Client :: ready");
    ssh.exec("uptime", (err, stream) => {
      if (err) throw err;
      stream
        .on("close", (code, signal) => {
          console.log(
            "Stream :: close :: code: " + code + ", signal: " + signal
          );
          ssh.end();
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
    privateKey: readFileSync(process.cwd() + "/id_rsa"),
    port: 22,
  });

module.exports = ssh;
