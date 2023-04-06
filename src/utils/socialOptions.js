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
const development = {
  github: {
    client: process.env.DEV_GITHUB_CLIENT,
    secret: process.env.DEV_GITHUB_SECRET,
  },
  facebook: {
    client: process.env.DEV_FACEBOOK_CLIENT,
    secret: process.env.DEV_FACEBOOK_SECRET,
  },
  google: {
    client: process.env.DEV_GOOGLE_CLIENT,
    secret: process.env.DEV_GOOGLE_SECRET,
  },
  naver: {
    client: process.env.DEV_NAVER_CLIENT,
    secret: process.env.DEV_NAVER_SECRET,
  },
  kakao: {
    client: process.env.DEV_KAKAO_CLIENT,
    secret: process.env.DEV_KAKAO_SECRET,
  },
};

const options = process.env.NODE_ENV ? production : development;

module.exports = options;
