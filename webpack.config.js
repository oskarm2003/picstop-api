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
                    /node_modules/
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.mjs'],
        //line bellow fixes the formidable lib problem
        //removed 'module' from mainFields to prevent .mjs files reading by formidable/dist/index.cjs (and by all other files)
        mainFields: ['browser', 'main']
    },
    externals: {
        sharp: 'commonjs sharp'
    }
}