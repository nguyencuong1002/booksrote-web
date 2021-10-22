const compression = require('compression')
const cors = require('cors')
const express = require('express')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const morgan = require('morgan')
const xss = require('xss-clean')
const routeConfig = require('../apis/routes')
const config = require('config')
const next = require('next')
require('dotenv').config()

module.exports = () => {
    const app = express()

    // set log request
    app.use(morgan('dev'))

    // set security HTTP headers
    app.use(helmet())

    // parse json request body
    app.use(express.json())

    // parse urlencoded request body
    app.use(express.urlencoded({ extended: true }))

    // sanitize request data
    app.use(xss())
    app.use(mongoSanitize())

    // gzip compression
    app.use(compression())

    // set cors blocked resources
    app.use(cors())
    app.options('*', cors())

    // setup nextjs
    // if (config.get('next.enable')) {
    //     const nextApp = next({ dev: config.get('next.devMode'), dir: './next' })
    //     const handle = nextApp.getRequestHandler()
    //     nextApp
    //         .prepare()
    //         .then(() => {
    //             console.log('Next App Initialized!')
    //             app.get('*', (req, res) => handle(req, res))
    //         })
    //         .catch((err) => {
    //             console.log('Start Frontend Error', err)
    //         })
    // }

    // api routes
    app.use('/', routeConfig)

    // // convert error to ApiError, if needed
    // app.use(errorConverter)

    // // handle error
    // app.use(errorHandler)

    app.listen(process.env.PORT)

    return app
}
