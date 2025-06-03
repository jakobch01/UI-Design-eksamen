const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  // ... your existing config ...
  plugins: [
    // …other plugins…
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',   // generates a `report.html` file
      openAnalyzer: true,       // automatically opens the report in your browser
    }),
  ],
};
