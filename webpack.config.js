// webpack.config.js
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  mode: "production",                // or "development" as needed
  entry: "./src/index.js",           // adjust to your entry point
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      // your loaders (e.g., babel-loader, css-loader) go here
    ],
  },
  plugins: [
    // …any other plugins you already use…
    new BundleAnalyzerPlugin({
      analyzerMode: "static", // Creates a `report.html` file in your output directory
      openAnalyzer: true,     // Automatically opens the report in your browser when you build
    }),
  ],
  // If you’re using code splitting, devServer, etc., add those here as well
};
