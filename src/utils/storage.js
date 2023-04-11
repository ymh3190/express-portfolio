const random = require("./randomFill");
const { conn } = require("./ssh");

class CustomAPIStorage {
  constructor(opts) {
    this.getDestination = opts.destination;
  }

  /**
   * multer 모듈에서 storage engine을 커스텀한 코드입니다
   * req: express reqeust object
   * file: 처리된 파일에 대한 정보를 담고있는 object
   * callback: 업로드된 파일을 제어할 수 있는 function -> uploadVideo
   * 플로우는 다음과 같습니다.
   * 클라이언트가 /videos/upload 혹은 /users/:id/update에 https 프로토콜을 요청합니다
   * 서버는 api를 호출하기 전에 middleware multer 객체인 uploader함수를 거치게 됩니다
   * 아래 _handleFile함수는 middleware 함수 처리중 호출되는 함수로
   * ssh 프로토콜을 이용해 큰 용량의 파일을 저장할 수 있는 서버에 접근하여 파일을 저장합니다
   * 이때 해당 상기 서버에 접속하는 유저는 보안상의 이유로 root유저가 아닌데, 이는
   * 리눅스 명령어 adduser user_name && usermod 777 -R folder_path를 통해 스토리지 서버의 경로에만 권한을 부여합니다
   * ssh는 소켓 통신으로, event를 emit하고 on하는 방법으로 통신을 합니다
   * random()함수는 buffer.alloc(16) 버퍼에 16바이트 크기를 할당하고 임의의 값으로 채운 후
   * 문자열을 출력합니다. 이때 32바이트가 되는데, 이는 1바이트가 8비트인 컴퓨터 시스템상 16바이트 표기가 용이하여 기인한 것으로
   * https://yceffort.kr/2021/10/understanding-of-nodejs-buffer 참고바랍니다.
   * sftp의 쓰기 스트림을 통해 상기 서버에 파일을 쓰고, 읽기 스트림 pipe함수를 통해 uploadVideo함수에서 처리된 결과가 반영된 file객체로 접근 가능토록 합니다
   * finish 이벤트를 on하여 쓰기 스트림의 끝났을 때를 처리합니다.
   * shell 함수로 Apache서버 기본 파일 경로인 /var/www/html에 해당 파일을 soft link하고
   * cb함수로 uploadVideo함수에 전달될 file객체를 갱신하고 ssh 연결을 끝습니다
   */
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
