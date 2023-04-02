const ssh = require("../db/ssh");

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

            // TODO: 스토리지 서버 url 제공, 파일 32비트 랜덤 문자(busboy module reference)
            const remotePath = `/mnt/volume_sgp1_01/${path}/${file.originalname}`;
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
      if (err) throw err;
      sftp.unlink(file.path, cb);
      ssh.end();
    });
  }
}

module.exports = (opts) => {
  return new CustomAPIStorage(opts);
};
