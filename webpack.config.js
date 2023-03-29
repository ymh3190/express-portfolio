const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: process.env.NODE_ENV ? "production" : "development",
  watch: process.env.NODE_ENV ? false : true,
  entry: {
    main: "./src/public/js/main.js",
    videoPlayer: "./src/public/js/videoPlayer.js",
    comment: "./src/public/js/comment.js",
    video: "./src/public/js/video.js",
    diffTime: "./src/public/js/diffTime.js",
    toISOString: "./src/public/js/toISOString.js",
    view: "./src/public/js/view.js",
  },
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "./css/styles.css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};
