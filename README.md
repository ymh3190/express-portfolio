# express-portfolio

- mysql 설치
  - 윈도우
    - powershell 혹은 cmd 관리자 모드 실행
    - wsl --install
    - 마이크로소프트 스토어에서 windows 터미널 설치
    - 우분투 실행 후 다음 명령어를 실행
    - sudo apt-get update
    - sudo apt-get install mysql-server
    - sudo ufw allow mysql (외부 접속 기능 설정, 포트 3306 오픈)
    - wsl로 설치시 systemctl 명령어가 먹히지 않는다.
    - sudo service mysql start
    - sudo mysql -uroot
  - 맥
    - brew install mysql
    - brew services start mysql
    - sudo mysql -uroot
  - 기본설정
    - CREATE DATABASE test DEFAULT CAHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci; (utf8 인코딩, ai: 악센트 구분 X, ci: 대소문자 구분 X)
    - CREATE USER 'admin'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
    - GRANT ALL PRIVILEGES ON test.* TO 'admin'@'localhost';
    - FLUSH PRIVILEGES;
    - sudo mysql -uadmin test
