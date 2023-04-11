# express-portfolio

- 홈페이지(과금 문제로, AWS EB로 변경예정): <https://express-portfolio.herokuapp.com/> (9~18시 런타임)

- 구현 기능
  - 유저, 비디오에 대한 CRUD(CREATE, READ, UPDATE, DELETE)
  - 소셜 로그인(Github, Facebook, Google, Naver, Kakao)

- 동작 화면

  ```
  MySQL 서버 접속
  ```

  - <img src="https://user-images.githubusercontent.com/59950687/230854366-a76bacc0-71c2-42c6-bba9-0b4a24d54e28.gif" alt="" width="500px">

  ```
  Apache 서버 접속
  ```

  - <img src="https://user-images.githubusercontent.com/59950687/230854382-3037c59c-1158-4e74-8fea-a0fad4269824.gif" alt="" width="500px">

  ```
  깃허브 소셜 로그인
  ```

  - <img src="https://user-images.githubusercontent.com/59950687/230854391-c6eaac73-92ff-48dc-a1b4-c4b62cb8f660.gif" alt="" width="500px">

  ```
  카카오 소셜 로그인
  ```

  - <img src="https://user-images.githubusercontent.com/59950687/230854396-6963a2cc-a00a-490c-b61b-e21fca4887fa.gif" alt="" width="500px">

  ```
  네이버 소셜 로그인
  ```

  - <img src="https://user-images.githubusercontent.com/59950687/230854397-536aa3ec-3b17-49f0-8cc5-7f0be072108c.gif" alt="" width="500px">

  ```
  구글 소셜 로그인
  ```

  - <img src="https://user-images.githubusercontent.com/59950687/230854393-b7887e99-d91f-4e4a-9086-58a1d5b4eed8.gif" alt="" width="500px">

  ```
  페이스북 소셜 로그인
  ```

  - <img src="https://user-images.githubusercontent.com/59950687/230854387-4c507501-faaa-43fc-9e28-52c337e58c5a.gif" alt="" width="500px">

  ```
  1. 현재 동영상 업로드 후 보이지 않는 문제는 HTTPS(IP주소만으론 SSL발급 불가)프토토콜 구현 불가에 기인한 것으로 기능엔 문제 없습니다
  2. 실제 서비스가 아니기에 소셜 로그인은 개발 ID로만 가능합니다. 이메일 가입후 테스트하시기 바랍니다
  3. 파일업로드시 동영상은 1000K, 프로필사진은 500K로 용량 제한이 있습니다
  ```

- API Specification: <https://express-portfolio.herokuapp.com/api> (작성중)

- 제작의도: mysql, ejs 사용법 그리고 +@에 목적이 있습니다.

- 관련기술
  - iaas: ubuntu + apache로 서버 환경 구축
  - ssh: <https://github.com/ymh3190/express-portfolio/blob/main/src/utils/storage.js>
- 개발 툴: Postman, Swagger
- 배포 서버: Heroku(paas)
- db 서버: Digitalocean database(paas, mysql)
- storage 서버(SSL 문제로, AWS S3로 변경예정): Digitalocean volume(iaas, ubuntu20.04+apache2)
