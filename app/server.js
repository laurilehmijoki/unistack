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
    const page = pages.findPage(req.url)
    if (page) {
        Promise
            .all([checksumPromise(cssFilePath), checksumPromise(bundleJsFilePath)])
            .then(([cssChecksum, bundleJsChecksum]) => {
                res.send(React.renderToString(basePage(
                    page,
                    page.initialState,
                    { cssChecksum, bundleJsChecksum}
                )))
            })
            .catch(next)
    } else {
        next()
    }
})

server.get('/api/credit-cards/:creditCard', (req, res, next) => {
    const simulatedBackendCallDelay = Math.random() * 100
    const creditCardNumber = req.params.creditCard
    const lengthOk = (() => {
        const length = creditCardNumber.replace(/\s/g, '').length
        return length >= 14 && length <= 16 // We accept credit cards that have [14,16] characters
    })()
    const NO_ERROR = undefined
    const response = {
        errors: [
            lengthOk ? NO_ERROR : 'The credit card number is too short or long',
            lengthOk && /^\s*1234.*/.test(creditCardNumber) ? NO_ERROR : 'You entered an invalid credit card number'
        ].filter(error => error !== NO_ERROR)
    }
    setTimeout(
        () => { res.json(response) },
        simulatedBackendCallDelay
    )

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

server.use(compression({threshold: 512}))

const checksumPromise = filePath =>
    fs
        .readFileAsync(filePath)
        .then(fileContent => crypto.createHash('md5').update(fileContent).digest('hex'))

export const start = () => {
    const PORT = process.env.PORT || 4000
    const reportPages = () => {
        pages.allPages.forEach(({pagePath}) => {
            console.log(`Page available at http://localhost:${PORT}${pagePath}`.green)
        })
    }
    server.listen(PORT, reportPages)
}
