const path = require("path");
const webpack = require("webpack");
const childProcess = require("child_process");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    main: "./src/app.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve("./dist"),
  },
  module: {
    rules: [
      {
        test: /\.js$/, // 로더가 처리해야될 파일들의 패턴(정규 표현식)
        use: [path.resolve("./my-webpack-loader.js")], //
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      // {
      //   test: /\.(png|jpg|gif|svg)$/,
      //   loader: "file-loader",
      //   options: {
      //     publicPath: "./dist/",
      //     name: "[name].[ext]?[hash]",
      //   },
      // },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "url-loader",
        options: {
          name: "[name].[ext]?[hash]",
          limit: 20000, // 20kb
        },
      },
    ],
  },
  // plugins: [new MyWebpackPlugin()],
  plugins: [
    new webpack.BannerPlugin({
      banner: `
        Build Date: ${new Date().toLocaleString()}
        Commit Version: ${childProcess.execSync("git rev-parse --short HEAD")}
        Author: ${childProcess.execSync("git config user.name")}
      `,
    }),
    new webpack.DefinePlugin({
      TWO: JSON.stringify("1+1"),
      "api.domain": JSON.stringify("http://dev.api.domain.com"),
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      templateParameters: {
        env: process.env.NODE_ENV === "development" ? "(개발용)" : "",
      },
      minify:
        process.env.NODE_ENV === "production"
          ? {
              collapseWhitespace: true,
              removeComments: true,
            }
          : false,
      hash: true,
    }),
    new CleanWebpackPlugin({}),
  ],
};
