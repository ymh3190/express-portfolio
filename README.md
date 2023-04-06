# express-portfolio

- 홈페이지 주소: <https://express-portfolio.herokuapp.com/>

- 제작의도: 기존 wetube-portfolio에서 db변경과 코드 개선에 목적이 있음
  - 개선코드
    - [x] multer 모듈 커스텀 / 관련 기술스택: ssh, sftp, ufw, Ubuntu 20.04, Apache
    - [x] NoSQL -> MySQL / 관련 기술스택: INSERT, SELECT, UPDATE, DELETE
    - [x] async await & try catch 반복 개선

- 개발 툴: expressjs, postman, swagger

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
    - [x] heroku
    - [x] digitalocean database(mysql)
    - [x] digitalocean volume(ubuntu, apache)
      - [x] HTTP
      - [] HTTPS
