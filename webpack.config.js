var webpack = require('webpack')
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin
var path = require('path')
var publicPath = process.env.devServer ? 'https://localhost:2993/_assets/' : '/_assets/';
var basic = require(path.resolve(__dirname + '/basic.loaders'));

module.exports = {
    devtool: 'source-map',
    entry: {
        'app': './app/main.js',
        'vendor': './app/vendor.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: publicPath,
        sourceMapFilename: 'debugging/[file].map'
    },
    module: {
        preLoaders: [
            {
                test: /\.(jsx|js|es6)$/,
                loader: 'eslint',
                include: [
                    path.resolve(__dirname, "src")
                ]
            }
        ],
        loaders: [
            basic, // use ! to chain loaders
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    plugins: [
        new CommonsChunkPlugin('vendor', 'vendor.bundle.js', Infinity)
    ]
};
