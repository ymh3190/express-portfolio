# express-portfolio

- .env 파일 환경 변수 설정
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

- 개발 툴: expressjs, postman

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
  - 칼럼 삭제
    - ALTER TABLE TALBE_NAME DROP COLUMN_NAME;

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

  - 배포
    - [] heroku(paas, 500MB 무료), google cloud(3달간 무료)
    - [] AWS RDB, AWS S3, AWS EC2(iaas) 혹은 EB(paas)
