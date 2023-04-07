# express-portfolio

- 홈페이지 주소: <https://express-portfolio.herokuapp.com/> (비용 발생으로 언제든지 종료될 수 있음, ymh3190@gmail.com으로 연락주시면 서버를 오픈 해드릴 예정입니다.)
- API Specification: <https://express-portfolio.herokuapp.com/api> (작성중)

- 제작의도: 기존 wetube-portfolio에서 db변경과 코드 개선에 목적이 있음
  - 개선코드
    - [x] storage engine: ssh, sftp, ufw, Ubuntu 20.04, Apache
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
          - 구현 장면
            <img width="100" alt="Screenshot 2023-04-06 at 11 38 56 PM" src="https://user-images.githubusercontent.com/59950687/230509155-8b04715e-eb16-4ed3-b771-bf36b3faded4.png"><img width="100" alt="Screenshot 2023-04-06 at 11 45 07 PM" src="https://user-images.githubusercontent.com/59950687/230509162-f8689ce3-4c48-43ec-9c69-0d7053ca772d.png"><img width="100" alt="Screenshot 2023-04-07 at 7 53 57 AM" src="https://user-images.githubusercontent.com/59950687/230509166-9250ba5a-0488-469f-9b42-99b83bc3a362.png"><img width="100" alt="Screenshot 2023-04-07 at 7 54 12 AM" src="https://user-images.githubusercontent.com/59950687/230509168-9d4b5041-23c7-44cf-8ece-0fa4596fe54f.png"><img width="100" alt="Screenshot 2023-04-07 at 7 55 44 AM" src="https://user-images.githubusercontent.com/59950687/230509171-c84aaeea-c1ba-4f15-96f4-bfd459d3ca1e.png"><img width="100" alt="Screenshot 2023-04-07 at 7 56 11 AM" src="https://user-images.githubusercontent.com/59950687/230509173-0b23759d-d956-4adc-82a5-7bfb3ff1c593.png"><img width="100" alt="Screenshot 2023-04-07 at 7 58 14 AM" src="https://user-images.githubusercontent.com/59950687/230509179-b69edee9-1ba8-4302-8485-97e69382cf7c.png"><img width="100" alt="Screenshot 2023-04-07 at 7 58 24 AM" src="https://user-images.githubusercontent.com/59950687/230509182-2a706f76-2333-4b40-890c-33d0de5a375b.png"><img width="100" alt="Screenshot 2023-04-07 at 7 58 50 AM" src="https://user-images.githubusercontent.com/59950687/230509183-23c53b23-9422-4255-8f62-f8bc17f9e2ea.png"><img width="100" alt="Screenshot 2023-04-07 at 7 59 39 AM" src="https://user-images.githubusercontent.com/59950687/230509185-bf9eba7b-51e3-4a3e-89a6-5688195215f3.png"><img width="100" alt="Screenshot 2023-04-07 at 7 59 57 AM" src="https://user-images.githubusercontent.com/59950687/230509189-4d9a1aae-80df-4fc5-8ac1-2b4160f4d746.png"><img width="100" alt="Screenshot 2023-04-07 at 8 00 47 AM" src="https://user-images.githubusercontent.com/59950687/230509191-b2cb9bee-a861-43f2-a626-9dfa760531e1.png"><img width="100" alt="Screenshot 2023-04-07 at 8 01 29 AM" src="https://user-images.githubusercontent.com/59950687/230509193-8ec129f4-7b3d-48e0-9244-edd83b4938cd.png">

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

  - 배포
    - [x] heroku
    - [x] digitalocean database(mysql)
    - [x] digitalocean volume(ubuntu, apache)
      - [x] HTTP
      - [x] HTTPS: SSL은 도메인 주소로만 발급받을 수 있음.
