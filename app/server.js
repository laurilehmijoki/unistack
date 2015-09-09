import express from 'express'
import React from 'react'
import basePage from './pages/basePage.js'
import * as pages from './pages/pages.js'
import path from 'path'
import sass from 'node-sass'
import compression from 'compression'
import crypto from 'crypto'
import Promise from 'bluebird'
const fs = Promise.promisifyAll(require('fs'))

const server = express()

const cssFilePath = path.resolve(`${__dirname}/../.generated/style.css`)
const bundleJsFilePath = path.resolve(`${__dirname}/../.generated/bundle.js`)

server.get('*', (req, res, next) => {
    if (req.query.checksum) {
        const oneYearInSeconds = 60 * 60 * 24 * 356
        res.setHeader('Cache-Control', `public, max-age=${oneYearInSeconds}`)
    }
    next()
})

server.get('*', (req, res, next) => {
    const page = pages.findPage(req.url)
    if (page) {
        Promise
            .all([fs.readFileAsync(cssFilePath), fs.readFileAsync(bundleJsFilePath)])
            .then(([cssContent, bundleJsContent]) => {
                res.send(React.renderToString(basePage(
                    page,
                    page.initialState,
                    {
                        cssChecksum: crypto.createHash('md5').update(cssContent).digest('hex'),
                        bundleJsChecksum: crypto.createHash('md5').update(bundleJsContent).digest('hex')
                    }
                )))
            })
            .catch(next)
    } else {
        next()
    }
})

server.get('/style.css', (req, res, next) => {
    res.sendFile(cssFilePath)
})

server.get('/bundle.js', (req, res, next) => {
    res.sendFile(bundleJsFilePath)
})

server.use(compression({threshold: 512}))

export const start = () => {
    const PORT = process.env.PORT || 4000
    const reportPages = () => {
        pages.allPages.forEach(({pagePath}) => {
            console.log(`Page available at http://localhost:${PORT}${pagePath}`.green)
        })
    }
    server.listen(PORT, reportPages)
}
