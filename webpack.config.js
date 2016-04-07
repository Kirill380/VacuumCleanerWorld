module.exports = {
    entry: {
        main: "./js/app/Main.js"
    },
    output: {
        path: __dirname + "/js/build",
        filename: "[name].js"

    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel'
        }, {
            test: /\.jade$/,
            exclude: /node_modules/,
            loader: 'jade'
        }, {
            test: require.resolve('snapsvg'),
            loader: 'imports-loader?this=>window,fix=>module.exports=0'
        }]
    },

    devtool: "source-map"
};