const webpack = require('webpack');
module.exports = {
    devServer: {
        disableHostCheck: true
    },
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                // 'window.Quill': './node_modules/quill/dist/quill.js',
                // 'Quill': './node_modules/quill/dist/quill.js',
                'window.Quill': 'quill',
                'Quill': 'quill',
            }),
        ]
    },
    pwa: {
        name: 'My App',
        themeColor: '#4DBA87',
        msTileColor: '#000000',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black',

        // настройки манифеста
        manifestOptions: {
            display: 'landscape',
            background_color: '#42B883'
            // ...другие настройки манифеста...
        },

        // настройка workbox-плагина
        // workboxPluginMode: 'InjectManifest',
        // workboxOptions: {
            // swSrc необходимо в режиме InjectManifest
            // swSrc: 'sw.js',
            // ...другие настройки Workbox...
        // }
    }
}
