var path = require('path');

const basic = [
  {
    test: /\.(jsx|js|es6)$/,
    include: [
      path.resolve(__dirname, "src"),
      path.resolve(__dirname, "app")
    ],
    loader: 'babel-loader'
  },
  {
    test: /\.less$/,
    loader: 'style-loader!css-loader!less-loader'
  },
  {
    test: /\.css$/,
    loader: 'style!css'
  },
  {
    test: /\.(ttf|eot|svg|png|jpg|gif|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: 'url-loader'
  }
];

module.exports = (function () {
  return basic;
}());
