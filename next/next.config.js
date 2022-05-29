var pjson = require('../package.json')
var config = require('config')
const path = require('path')

module.exports = {
    reactStrictMode: true,
    serverRuntimeConfig: {
        // Will only be available on the server side
        mySecret: 'secret',
        secondSecret: process.env.SECOND_SECRET, // Pass through env variables
    },
    publicRuntimeConfig: {
        seo: {
            title: 'N17DCAT009',
            siteName: 'ptithcm',
        },
    },
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
}
