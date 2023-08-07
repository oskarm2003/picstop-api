const path = require('path')

module.exports = {
    target: 'node',
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: [
                    /node_modules/,
                    /\.test.ts$/
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    }
}