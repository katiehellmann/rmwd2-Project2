const path = require('path');
//const { default: PasswordForm } = require('./client/PasswordForm');

module.exports = {
    entry: {
        app: './client/maker.jsx',
        login: './client/login.jsx',
        //PasswordForm: './client/PasswordForm.jsx',
        profile: './client/UserProfile.jsx',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
        ],
    },
    mode: 'production',
    watchOptions: {
        aggregateTimeout: 200,
    },
    output: {
        path: path.resolve(__dirname, 'hosted'),
        filename: '[name]bundle.js',
    },
};