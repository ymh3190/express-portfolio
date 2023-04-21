const aws = require("aws-sdk");
const multerS3 = require("multer-s3");

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_S3_CLIENT,
    secretAccessKey: process.env.AWS_S3_SECRET,
  },
});

module.exports = (path) => {
  return multerS3({
    s3: s3,
    bucket: `express-portfolio/${path}`,
    acl: "public-read",
  });
};
