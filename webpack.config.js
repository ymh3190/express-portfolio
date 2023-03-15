const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  entry: {
    main: "./src/public/js/main.js",
    videoPlayer: "./src/public/js/videoPlayer.js",
    comment: "./src/public/js/comment.js",
    video: "./src/public/js/video.js",
    diffTime: "./src/public/js/diffTime.js",
    toISOString: "./src/public/js/toISOString.js",
  },
  output: {
    filename: "js/[name].js",
    path: process.cwd() + "/dist",
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
