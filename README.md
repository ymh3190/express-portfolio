# express-portfolio

- 홈페이지(과금 문제로, AWS EB로 변경예정): <https://express-portfolio.herokuapp.com/> (9~18시 런타임)
- API Specification: <https://express-portfolio.herokuapp.com/api> (작성중)

- 제작의도: 기존 wetube-portfolio에서 db변경과 코드 개선에 목적이 있음
- 관련기술
  - iaas: ubuntu + apache로 서버 환경 구축
  - ssh: <https://github.com/ymh3190/express-portfolio/blob/main/src/utils/storage.js>
- 개발 툴: Postman, Swagger
- 배포 서버: heroku(paas)
- db 서버: digitalocean database(paas, mysql)
- storage 서버(SSL 문제로, AWS S3로 변경예정): digitalocean volume(iaas, ubuntu 20.04+apache)

- 구현 기능
  - 유저, 비디오에 대한 CRUD(CREATE, READ, UPDATE, DELETE)
  - 소셜 로그인(Github, Facebook, Google, Naver, Kakao)

- 동작 화면
  - <div>MySQL 서버 접속 <img src="https://user-images.githubusercontent.com/59950687/230725300-e56e6d83-1207-4cd6-ad36-5ca773822d8c.gif" alt="" width="100px"></div>
  - <div>Apache 서버 접속 <img src="https://user-images.githubusercontent.com/59950687/230725307-e32a2b65-91d8-433f-98af-157655bb53d8.gif" alt="" width="100px"></div>
  - <div>카카오 소셜 로그인 <img src="https://user-images.githubusercontent.com/59950687/230725308-f9a15d41-6e2e-4f76-b1d3-5c4c426e519e.gif" alt="" width="100px"></div>
  - <div>네이버 소셜 로그인 <img src="https://user-images.githubusercontent.com/59950687/230725310-622d43fb-83d2-4331-aee4-829056b37d8d.gif" alt="" width="100px"></div>
  - <div>구글 소셜 로그인 <img src="https://user-images.githubusercontent.com/59950687/230725311-46c7e952-f3cd-424e-b29b-692ebd736253.gif" alt="" width="100px"></div>
  - <div>페이스북 소셜 로그인 <img src="https://user-images.githubusercontent.com/59950687/230725313-5eb90ef0-b0bb-4d19-8eea-7b12483f5499.gif" alt="" width="100px"></div>
