const production = {
  github: {
    client: process.env.GITHUB_CLIENT,
    secret: process.env.GITHUB_SECRET,
  },
  facebook: {
    client: process.env.FACEBOOK_CLIENT,
    secret: process.env.FACEBOOK_SECRET,
  },
  google: {
    client: process.env.GOOGLE_CLIENT,
    secret: process.env.GOOGLE_SECRET,
  },
  naver: {
    client: process.env.NAVER_CLIENT,
    secret: process.env.NAVER_SECRET,
  },
  kakao: {
    client: process.env.KAKAO_CLIENT,
    secret: process.env.KAKAO_SECRET,
  },
};

const socialOptions = production;

module.exports = { socialOptions };
