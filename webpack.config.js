const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const isDev = process.env.NODE_ENV !== 'production';

const config = {
    mode: isDev ? 'development' : 'production',
    entry: './src/scripts/app.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin([
            { from: 'src/index.html' },
            { from: 'src/css/style.css', to: 'css/' },
            { from: 'src/images/bg.jpg', to: 'images/' },
            { from: 'src/images/background.png', to: 'images/' },
            { from: 'src/images/spin_bg.png', to: 'images/' },
            { from: 'src/images/spin.png', to: 'images/' },
            { from: 'src/images/spin_play.png', to: 'images/' },
            { from: 'src/images/spin_stop.png', to: 'images/' },
            { from: 'src/images/spin_arrow.png', to: 'images/' },
            { from: 'src/images/stop.png', to: 'images/' },
            { from: 'src/images/speed.png', to: 'images/' },
            { from: 'src/images/speed2.png', to: 'images/' },
            { from: 'src/images/speed_text.png', to: 'images/' },
            { from: 'src/images/x1.png', to: 'images/' },
            { from: 'src/images/x2.png', to: 'images/' },
            { from: 'src/images/x3.png', to: 'images/' },
            { from: 'src/images/x4.png', to: 'images/' },
            { from: 'src/images/orange.png', to: 'images/' },
            { from: 'src/images/pineapple.png', to: 'images/' },
            { from: 'src/images/pomegranate.png', to: 'images/' },
        ]),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 8080,
        hot: true
    },
    optimization: {
        minimize: !isDev
      }
};

module.exports = config;