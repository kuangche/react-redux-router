const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const CleanWebpackPlugin = require('clean-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const config = require('./project.config')

module.exports = {
    watch: true,
    entry: {
        app: [
            'react-hot-loader/patch',
            `webpack-dev-server/client?http://${config.ip}:${config.port}`,
            'webpack/hot/only-dev-server',
            './src/index.js'
        ],
        vendor: config.vendor
    },
    output: {
        filename: 'scripts/[name].js',
        sourceMapFilename: '[file].map',
        hotUpdateChunkFilename: 'hot/hot-update.js',
        hotUpdateMainFilename: 'hot/hot-update.json'
    },
    devtool: 'cheap-module-eval-source-map',
    resolve: {
        modules: [
            config.defaultPath.APP_PATH,
            'node_modules'
        ],
        alias: {
            root: path.resolve(__dirname, './src'),
            base: path.resolve(__dirname, './src/framework/base'),
            framework: path.resolve(__dirname, './src/framework'),
            conf: path.resolve(__dirname, './src/conf'),
            dialog: path.resolve(__dirname, './src/framework/dialog'),
            loading: path.resolve(__dirname, './src/framework/loading'),
            plugins: path.resolve(__dirname, './src/plugins'),
            particles: path.resolve(__dirname, './src/plugins/particles.js'),
        },
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include: path.resolve(__dirname, './src'),
                loader: 'eslint-loader',
                enforce: 'pre',
                options: {
                    cache: true,
                    formatter: require('eslint-friendly-formatter')
                }
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    presets: ['env', 'stage-0', 'react'],
                    plugins: [
                        'react-hot-loader/babel',
                        'transform-decorators-legacy',
                        'syntax-dynamic-import'
                    ]
                }
            },
            {
                test: path.resolve(__dirname, './src/conf/injection.js'),
                loader: `imports-loader?domain=>
                ${JSON.stringify(config.development.domain)}`
            }
        ]
    },
    plugins: [
        // new CleanWebpackPlugin(['dist']),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: [
                'vendor', 'runtime'
            ],
            filename: 'scripts/[name].js',
            minChunks: Infinity
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new FriendlyErrorsPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            title: '示例工程',
            description: '这是一个示例产品工程',
            filename: 'index.html',
            inject: 'body',
            chunks: ['runtime', 'vendor', 'app'],
            chunksSortMode: 'manual',
            minify: {
                removeComments: true
            },
            cache: false
        })
    ],
    devServer: {
        contentBase: './dist',
        publicPath: '/',
        historyApiFallback: true,
        clientLogLevel: 'none',
        host: config.ip,
        port: config.port,
        open: false,
        openPage: '',
        hot: true,
        inline: false,
        compress: true,
        stats: {
            colors: true,
            errors: true,
            warnings: true,
            modules: false,
            chunks: false
        },
        proxy: (function () {
            const obj = {}
            const target = `${config.proxy.target}:${config.proxy.proxyPort}`
            config.proxy.paths.forEach((apiPath) => {
                obj[apiPath] = target
            })
            
            return obj
        }())
    }
}
