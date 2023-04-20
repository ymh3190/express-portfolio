# express-portfolio

- [홈페이지, AWS EB, 세부 설정 변경 예정 &rarr;](http://expressportfolio-env.eba-7rezypbh.ap-northeast-2.elasticbeanstalk.com)
- 홈페이지, AWS Kubernetes 사용 예정
- [API Specification(틈틈이 작성중) &rarr;](http://expressportfolio-env.eba-7rezypbh.ap-northeast-2.elasticbeanstalk.com/api)
- [Custom storage engine 설명 &rarr;](https://github.com/ymh3190/express-portfolio/blob/main/src/utils/storage.js)
- TODO
  - [] AWS HTTP -> HTTPS(DNS + SSL)
  - [] AWS kubernetes
  - [] 결제 시스템 Stripe
- 관련 Linux 명령어
  - chmod 777 -R folder_path\n lsof -i | grep -i tcp\n rm file_path file_path\n ln -s file_path file_path\n zip file_path -r \* .[^.]*\n
  - lima(맥 리눅스 VM), nerdctl
- 실제 동작
  [MySQL](https://user-images.githubusercontent.com/59950687/230854366-a76bacc0-71c2-42c6-bba9-0b4a24d54e28.gif)
  [Apache](https://user-images.githubusercontent.com/59950687/230854382-3037c59c-1158-4e74-8fea-a0fad4269824.gif)
  [Github](https://user-images.githubusercontent.com/59950687/230854391-c6eaac73-92ff-48dc-a1b4-c4b62cb8f660.gif)
  [Kakao](https://user-images.githubusercontent.com/59950687/230854396-6963a2cc-a00a-490c-b61b-e21fca4887fa.gif)
  [Naver](https://user-images.githubusercontent.com/59950687/230854397-536aa3ec-3b17-49f0-8cc5-7f0be072108c.gif)
  [Google](https://user-images.githubusercontent.com/59950687/230854393-b7887e99-d91f-4e4a-9086-58a1d5b4eed8.gif)
  [Facebook](https://user-images.githubusercontent.com/59950687/230854387-4c507501-faaa-43fc-9e28-52c337e58c5a.gif)

- MySQL

  ```zsh
    mysqldump -uroot --database db_name > dump_name.sql
    mysql -u doadmin -p -h express-portfolio-do-user-13829492-0.b.db.ondigitalocean.com -P 25060 -D defaultdb < dump_name.sql
  ```

  ```zsh
    CREATE DATABASE database_name
    DEFAULT CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;
  ```

  ```zsh
    CREATE TABLE users(
      id CHAR(32) PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password char(60) NOT NULL,
      profile_photo varchar(137),
      social BOOLEAN DEFAULT 0);
  ```

  ```zsh
    CREATE TABLE videos(
      id char(32) PRIMARY KEY,
      path varchar(70) NOT NULL,
      title varchar(50) NOT NULL,
      description varchar(100) NOT NULL,
      user_id char(32) NOT NULL,
      user_profile_photo VARCHAR(137),
      user_name VARCHAR(20),
      view INT DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
  ```

  ```zsh
    CREATE TABLE comments(
      id CHAR(32) PRIMARY KEY,
      context VARCHAR(255) NOT NULL,
      video_id CHAR(32) NOT NULL,
      user_id CHAR(32) NOT NULL,
      user_name VARCHAR(20),
      FOREIGN KEY video_id REFERENCES videos(id) ON DELETE CASCADE,
      FOREIGN KEY user_id REFERENCES users(id) ON DELETE CASCADE);
  ```

  ```zsh
    CREATE TABLE histories(
      user_id CHAR(32),
      video_id CHAR(32),
      path VARCHAR(70) NOT NULL,
      user_name VARCHAR(20) NOT NULL,
      title VARCHAR(50) NOT NULL,
      description VARCHAR(100),
      view INT DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, video_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE);
  ```
