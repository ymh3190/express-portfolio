import random from "./randomFill.js";
import conn from "./ssh.js";

/**
 * multer 커스텀 스토리지 엔진
 */
class CustomAPIStorage {
  constructor(opts) {
    this.getDestination = opts.destination;

    // ChatGPT
    this.isConnected = false;
  }

  _handleFile(req, file, cb) {
    this.getDestination(req, file, (err, path) => {
      if (err) return cb(err);

      /**
       * 두번째 업로드부터 파일쓰기를 두번하는 문제가 발생하여
       * ChatGPT를 통한 코드 수정
       * DigitalOcean 사용기한 만료로 테스트 해보진 못함
       */
      // ChatGPT
      const handleUpload = () => {
        const hex = random();
        const remotePath = `/mnt/volume_sgp1_01/${path}/${hex}`;
        const outStream = conn.sftp((err, sftp) => {
          if (err) return cb(err);

          const outStream = sftp.createWriteStream(remotePath);
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

        file.stream.pipe(outStream);
      };

      conn.on("close", () => {
        cb(null, {
          path: `http://${process.env.DROPLETS_HOST}/${path}/${hex}`,
          size: outStream.bytesWritten,
        });
      });

      if (this.isConnected) {
        handleUpload();
      } else {
        conn
          .on("ready", () => {
            this.isConnected = true;
            handleUpload();
          })
          .connect({
            host: process.env.DROPLETS_HOST,
            username: process.env.DROPLETS_USER,
            password: process.env.DROPLETS_PASSWORD,
          });
      }

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
