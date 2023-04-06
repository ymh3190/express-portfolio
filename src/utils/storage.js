const ssh = require("../db/ssh");
const random = require("../utils/randomFill");

class CustomAPIStorage {
  constructor(opts) {
    this.getDestination = opts.destination;
  }

  _handleFile(req, file, cb) {
    this.getDestination(req, file, (err, path) => {
      if (err) return cb(err);

      ssh
        .on("ready", () => {
          ssh.sftp((err, sftp) => {
            if (err) return cb(err);

            const hex = random();
            const remotePath = `/mnt/volume_sgp1_01/${path}/${hex}`;
            const outStream = sftp.createWriteStream(remotePath);
            file.stream.pipe(outStream);

            outStream.once("error", cb);
            outStream.once("finish", () => {
              const command = `ln -s ${remotePath} /var/www/html/${hex}`;
              ssh.exec(command, (err, stream) => {
                if (err) return cb(err);

                stream.on("exit", () => {
                  ssh.end();
                  cb(null, {
                    path: `http://${process.env.DROPLETS_HOST}/${hex}`,
                    size: outStream.bytesWritten,
                  });
                });
              });
            });
          });
        })
        .connect({
          host: process.env.DROPLETS_HOST,
          username: process.env.DROPLETS_USER,
          password: process.env.DROPLETS_PASSWORD,
        });
    });
  }

  _removeFile(req, file, cb) {
    ssh.sftp((err, sftp) => {
      if (err) return cb(err);
      sftp.unlink(file.path, cb);
    });
  }
}

module.exports = (opts) => {
  return new CustomAPIStorage(opts);
};
