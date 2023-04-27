import random from "./randomFill.js";
import conn from "./ssh.js";

/**
 * multer 커스텀 스토리지 엔진
 */
class CustomAPIStorage {
  constructor(opts) {
    this.getDestination = opts.destination;
  }

  _handleFile(req, file, cb) {
    this.getDestination(req, file, (err, path) => {
      if (err) return cb(err);
      conn
        .on("ready", () => {
          conn.sftp((err, sftp) => {
            if (err) return cb(err);

            const hex = random();
            const remotePath = `/mnt/volume_sgp1_01/${path}/${hex}`;
            const outStream = sftp.createWriteStream(remotePath);
            file.stream.pipe(outStream);

            outStream.once("error", cb);
            outStream.once("finish", () => {
              conn.shell((err, stream) => {
                if (err) return cb(err);
                stream.on("exit", () => {
                  conn.end();
                });
                const command = `ln -s ${remotePath} /var/www/html/${path}/${hex}\nexit\n`;
                stream.end(command);
              });
            });
          });
        })
        .on("close", () => {
          cb(null, {
            path: `http://${process.env.DROPLETS_HOST}/${path}/${hex}`,
            size: outStream.bytesWritten,
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
    conn.sftp((err, sftp) => {
      if (err) return cb(err);
      sftp.unlink(file.path, cb);
    });
  }
}

export default (opts) => {
  return new CustomAPIStorage(opts);
};
