const ssh = require("../utils/ssh");

class CustomAPIStorage {
  constructor(opts) {
    this.getDestination = opts.destination;
  }

  _handleFile(req, file, cb) {
    this.getDestination(req, file, (err, path) => {
      if (err) return cb(err);

      ssh.on("ready", () => {
        ssh.sftp((err, sftp) => {
          if (err) return cb(err);

          const remotePath = `/mnt/volume_sgp1_01/${path}${file.originalname}`;
          const outStream = sftp.createWriteStream(remotePath);
          file.stream.pipe(outStream);

          outStream.once("error", cb);
          outStream.once("finish", () => {
            cb(null, {
              path: remotePath,
              size: outStream.bytesWritten,
            });
          });
        });
      });

      ssh.connect({
        host: process.env.DROPLETS_HOST,
        username: process.env.DROPLETS_USER,
        password: process.env.DROPLETS_PASSWORD,
      });
    });
  }

  _removeFile(req, file, cb) {
    ssh.sftp((err, sftp) => {
      if (err) throw err;
      sftp.unlink(file.path, cb);
      ssh.end();
    });
  }
}

module.exports = function (opts) {
  return new CustomAPIStorage(opts);
};
