const random = require("./randomFill");
const { conn } = require("./ssh");

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
              const command = `ln -s ${remotePath} /var/www/html/${path}/${hex}\nexit\n`;
              conn.shell((err, stream) => {
                if (err) return cb(err);

                stream.on("exit", () => {
                  cb(null, {
                    path: `http://${process.env.DROPLETS_HOST}/${path}/${hex}`,
                    size: outStream.bytesWritten,
                  });
                  conn.end();
                });
                stream.end(command);
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

  /**
   * Delete files when the limit is exceeded
   */
  _removeFile(req, file, cb) {
    conn.sftp((err, sftp) => {
      if (err) return cb(err);

      sftp.unlink(file.path, cb);
    });
  }
}

module.exports = (opts) => {
  return new CustomAPIStorage(opts);
};
