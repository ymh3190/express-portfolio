# express-portfolio

- 홈페이지 주소: <https://express-portfolio.herokuapp.com/>

- 로컬에서 실행시 .env 파일 환경 변수 설정
  - PORT
  - COOKIE_SECRET
  - MAIL_ADDRESS: 맥에서 작업했으며, 이메일 계정 추가가 필요함
  - MAIL_PASSWORD
  - GITHUB_CLIENT: 깃허브 앱 생성 필수, 이하 동일
  - GITHUB_SECRET
  - FACEBOOK_ID
  - FACEBOOK_SECRET
  - GOOGLE_CLIENT
  - GOOGLE_SECRET
  - NAVER_CLIENT
  - NAVER_SECRET
  - KAKAO_CLIENT
  - KAKAO_SECRET

- 개발 툴: expressjs, postman, swagger(문서화 툴, 배워볼 예정)

- mysql 설치

  - 윈도우
    - powershell 혹은 cmd 관리자 모드 실행
    - wsl --install
    - 마이크로소프트 스토어에서 windows 터미널 설치
    - 우분투 실행 후 다음 명령어를 실행
    - sudo apt-get update
    - sudo apt-get install mysql-server
    - sudo ufw allow mysql
    - sudo service mysql start
    - sudo mysql -uroot
  - 맥
    - brew install mysql
    - brew services start mysql
    - sudo mysql -uroot
  - 기본설정
    - CREATE DATABASE test DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci; (utf8 인코딩, ai: 악센트 구분 X, ci: 대소문자 구분 X)
    - CREATE USER 'admin'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
    - GRANT ALL PRIVILEGES ON test.\* TO 'admin'@'localhost';
    - FLUSH PRIVILEGES;
    - sudo mysql -uadmin test
  - 테이블 생성
    - CREATE TABLE users(id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255) NOT NULL UNIQUE, name VARCHAR(50) NOT NULL, password VARCHAR(255) NOT NULL, profilePhoto VARCHAR(255), social BOOL DEFAULT FALSE);
    - CREATE TABLE videos(id INT AUTO_INCREMENT PRIMARY KEY, path VARCHAR(255) NOT NULL UNIQUE, title VARCHAR(50) NOT NULL, description VARCHAR(255) NOT NULL, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, userId INT, view INT DEFAULT 0, userProfilePhoto VARCHAR(255), userName VARCHAR(50));
    - CREATE TABLE comments(id INT AUTO_INCREMENT PRIMARY KEY, context VARCHAR(255) NOT NULL, videoId INT, userId INT, userName VARCHAR(50));
    - CREATE TABLE histories(userId INT, videoId INT, path VARCHAR(255) NOT NULL UNIQUE, userName varchar(50) NOT NULL, title VARCHAR(50) NOT NULL, description VARCHAR(255) NOT NULL, view INT NOT NULL, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(userId, videoId));
  - db 호스팅 서비스 이용시
    - mysqldump -uadmin test > test.sql를 통해 로컬에서 생성한 데이터베이스를 서버로 쉽게 migrate할 수 있음
  - 스토리지 서버: SSH DROPLETS_USER@DROPLETS_HOST

- 구현 기능
  - 백엔드
    - db: nosql -> mysql
    - view engine: pug -> ejs
    - 유저
      - [x] 회원 가입
      - [x] 로그인, 로그아웃
      - [x] 이메일 인증번호를 통한 비밀번호 찾기
      - [x] 유저 정보 수정 권한
      - [x] 유저 정보 수정, 삭제
      - [x] 프로필 사진 추가, 수정
      - [x] 소셜 인증(REST API)
        - [x] Github
        - [x] Facebook
        - [x] Google
        - [x] Naver
        - [x] Kakao

    - 비디오
      - [x] 업로드
      - [x] 비디오 편집 권한
      - [x] 비디오 편집, 삭제
      - [x] 댓글 추가, 삭제
      - [x] 업로드 시간
      - [x] 조회수
      - [x] 히스토리

  - 프론트엔드
    - [x] 페이지
    - [x] 비디오 플레이어 재생, 볼륨, 플레이 타임, 확대
    - [x] 비디오 플레이어 마우스 반응
    - [] 타임라인

  - 배포 및 경험해 본 툴
    - iaas vs pass
      - 비용만 놓고 보면 iaas가 paas보다 압도적으로 낮다고 함. 결국 개발자로서 추구해야 하는 방향은 iaas가 아닐까
    - [x] heroku(paas, heroku도 AWS EC2위에서 동작함)
    - [] google cloud(iaas, paas, saas)
    - [x] digitalocean(paas): mysql client does not support ssl authentication. 이 에러는 공식문서에 따르면 mysql 버전에 따른 비밀번호 암호화 방식(8.x 이상 caching_sha2_password)의 차이에 기인함. 터미널에서 db서버 접속 후 ALTER USER use_your_user IDENTIFIED WITH mysql_native_password BY 'your_password'; 명령어로 수정 후 접속 가능 확인
    - digitalocean volume(iaas, AWS EC2에서 돌아감): ssh 접속 완료. 업로드시 스토리지 서버에 접근해서 해당 파일을 업로드 하지만, url로 어떻게 제공해주지? -> 'public network ipv4 address로 누구든지 접속할 수 있다' 문구 확인
      - ![storage](https://user-images.githubusercontent.com/59950687/229384658-891519f8-1435-49e6-ae1c-9e8085f5423b.png)
      - ![storage server port](https://user-images.githubusercontent.com/59950687/229408382-f5949cc0-378c-4f70-bed0-5781a791dabb.png)
      - Firewalls Inbound Rules
        - [x] SSH, PORT 22
        - [] HTTP(80), HTTPS(443) -> 설정했지만 작동하지 않는 이유는 HTTP 응답이 없기 때문 스토리지 서버 응답을 위한 서버를 빌드하면 되겠네(apache2)
    - [x] AWS RDB
    - [x] AWS S3
    - [] AWS EC2(iaas)
    - [x] AWS EB(paas)
    - [] docker
