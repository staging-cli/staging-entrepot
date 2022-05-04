const path = require('path');
const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const env = require('yargs').argv.env

const serverInfo = {
    apiUrl: '',
    websockUrl: ''
}

if (env == 'dev') {
    serverInfo.apiUrl = ''
    serverInfo.websockUrl = ''
}

module.exports = {
    entry: './index',
    output: {
        path: path.join(__dirname, './build'),
        filename: "core.js"
    },
    mode: "development", // 开发模式
    // mode: "production", // 发布模式
    target: 'web', // 默认是web环境不能进入引入模块中，需要改成node
    devServer: {
        client: {
            logging: 'error',
            progress: true,
        },
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            },
            {
                test:/\.(png|jpg|jpeg|gif)$/,
                //从右到左  从下到上
                // use:['url.loader',{'file':'file-loader',option:{}}]
                loader:'url-loader',
                options:{
                    publicPath:'./images/',
                    outputPath:'images/',
                    limit: 1024 * 5, //小于5KB转base64
                    name:'[name][hash:8].[ext]'
                }
            },
            {
                test:/\.html$/,
                loader:'html-loader',
                options:{ //需要配置这块儿就可以了
                    esModule:false
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            PRODUCTION: JSON.stringify(true),
            process:{
                env: {
                    serverInfo: JSON.stringify(serverInfo)
                }}
        }),

        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'js'),
                    to: path.resolve(__dirname, 'build/js')
                },
                {
                    from: path.resolve(__dirname, 'css'),
                    to: path.resolve(__dirname, 'build/css')
                }
            ]
        }),

        // 增加如下代码段
        new HtmlPlugin({
            template: './public/index.html',
        })
    ],
}
