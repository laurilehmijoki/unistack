import express from 'express'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import basePage from './pages/basePage.js'
import * as pages from './pages/pages.js'
import path from 'path'
import sass from 'node-sass'
import compression from 'compression'
import crypto from 'crypto'
import Promise from 'bluebird'
const fs = Promise.promisifyAll(require('fs'))

const server = express()

server.use(compression({threshold: 512}))

const cssFilePath = path.resolve(`${__dirname}/../.generated/style.css`)
const bundleJsFilePath = path.resolve(`${__dirname}/../.generated/bundle.js`)

const movies = [ // An in-memory movie database
    {
        id: '3ad9aa',
        title: 'Streets of London',
        imageUrl: '/images/streets-of-london.jpg',
        startTime: '6:30 PM'
    },
    {
        id: 'f4f5a6',
        title: 'Rafters',
        imageUrl: '/images/rafters.jpg',
        startTime: '8 PM'
    },
    {
        id: '030103',
        title: 'The Banana Agent',
        imageUrl: '/images/banana-agent.jpg',
        startTime: '9:30 PM'
    }
]

var bookings = {} // An in-memory bookings database

server.get('*', (req, res, next) => {
    const page = pages.findPage(req.url)
    if (page) {
        Promise
            .all([checksumPromise(cssFilePath), checksumPromise(bundleJsFilePath)])
            .then(([cssChecksum, bundleJsChecksum]) => {
                res.send(ReactDOMServer.renderToString(basePage(
                    page,
                    page.initialState(movies, req.url, bookings[page.findUserId(req.url)]),
                    { cssChecksum, bundleJsChecksum}
                )))
            })
            .catch(next)
    } else {
        next()
    }
})

server.put('/api/users/:userId/bookings/:movieId', (req, res, next) => {
    var userId = req.params.userId
    const userBookings = bookings[userId] || {}
    bookings[userId] = {...userBookings,
        [req.params.movieId]: parseInt(req.query.amountOfTickets)
    }
    res.send('ok')
})

const serveStaticResource = filePath => (req, res, next) => {
    checksumPromise(filePath)
        .then(checksum => {
            if (req.query.checksum == checksum) {
                const oneYearInSeconds = 60 * 60 * 24 * 356
                res.setHeader('Cache-Control', `public, max-age=${oneYearInSeconds}`)
                res.sendFile(filePath)
            } else {
                res.status(404).send()
            }
        })
        .catch(next)
}

server.get('/style.css', serveStaticResource(cssFilePath))

server.get('/bundle.js', serveStaticResource(bundleJsFilePath))

server.use('/images', express.static(`${__dirname}/images`))

const checksumPromise = filePath =>
    fs
        .readFileAsync(filePath)
        .then(fileContent => crypto.createHash('md5').update(fileContent).digest('hex'))

export const start = () => {
    const PORT = process.env.PORT || 4000
    const reportPages = () => {
        console.log(`App available at http://localhost:${PORT}`.green)
    }
    return new Promise((resolve, reject) => {
        server.listen(PORT, resolve)
    }).then(reportPages)
}
