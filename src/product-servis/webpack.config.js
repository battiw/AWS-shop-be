// Import path for resolving file paths
const path = require("path");
const slsw = require("serverless-webpack");

exports.module = {
  // Specify the entry point for our app.
  entry: slsw.lib.entries,
  target: "node",
  // Specify the output file containing our bundled code
  output: {
    libraryTarget: "commonjs",
    path: path.resolve(__dirname, ".webpack"),
    filename: "[name].js",
  },
  externals: [nodeExternals()],

  module: {
    /**
     * Tell webpack how to load 'json' files.
     * When webpack encounters a 'require()' statement
     * where a 'json' file is being imported, it will use
     * the json-loader.
     */
    loaders: [
      {
        test: /\.json$/,
        loaders: ["json"],
      },
    ],
  },
};
