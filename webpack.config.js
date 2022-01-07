const { exec } = require("child_process");
const path = require("path");

module.exports = {
  target: "web",
  mode: "development",
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    devMiddleware: {
      writeToDisk: true,
    },
  },
  // stats: "none",
  entry: {
    main: "./src/main.ts",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
    clean: true,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    modules: ["./node_modules"],
    alias: {
      "@blz": path.resolve(__dirname, "node_modules/blaze-2d/lib/src"),
    },
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        // options: {
        //   silent: true,
        // },
      },
    ],
  },
  plugins: [
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap("PublicPathCopyPlugin", (compilation) => {
          const public = path.resolve(__dirname, "public/*");
          const dist = path.resolve(__dirname, "dist");

          const command = `cp -R ${public} ${dist}`;
          exec(command);
        });
      },
    },
  ],
};
