# express-portfolio

- 홈페이지 주소(과금문제로, AWS EB로 변경예정): <https://express-portfolio.herokuapp.com/> 9~18시 런타임
- API Specification: <https://express-portfolio.herokuapp.com/api>

- 제작의도: 기존 wetube-portfolio에서 db변경과 코드 개선에 목적이 있음
- 개발 툴: postman, swagger
- 배포 서버: heroku(paas)
- 디비 서버: digitalocean database(paas, mysqldb)
- 스토리지 서버(SSL 문제로, AWS S3로 변경예정): digitalocean volume(iaas, ubuntu 20.04+apache)

- 구현 기능
  - 유저, 비디오에 대한 CRUD(CREATE, READ, UPDATE, DELETE)
  - 소셜 로그인(Github, Facebook, Google, Naver, Kakao)
