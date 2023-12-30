const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    popup: path.join(__dirname, 'src', 'popup.ts'),
    background: path.join(__dirname, 'src', 'background.ts'), // Uncomment if you have a background script
    // content: path.join(__dirname, 'src', 'content.ts'), // Uncomment if you have a content script
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/hello.html', to: 'hello.html' },
        { from: 'src/hello_extensions.png', to: 'hello_extensions.png' },
        // Add more assets as needed
      ]
    }),
  ]
};
