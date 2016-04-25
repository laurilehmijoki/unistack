import express from 'express'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import basePage from './pages/basePage.js'
import * as pages from './pages/pages.js'
import path from 'path'
import crypto from 'crypto'
import * as database from './database'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

const server = express()

const cssFilePath = path.resolve(`${__dirname}/../.generated/style.css`)
const bundleJsFilePath = path.resolve(`${__dirname}/../.generated/bundle.js`)

server.use(cookieParser())

server.get('*', (req, res, next) => {
    const page = pages.findPage(req.url)
    if (page) {
        Promise
            .all([
                checksumPromise(cssFilePath),
                checksumPromise(bundleJsFilePath),
                page.initialState({
                    database,
                    query: req.query,
                    cookies: req.cookies
                })
            ])
            .then(([cssChecksum, bundleJsChecksum, pageInitialState]) => {
                Object.keys(page.httpHeaders || {}).forEach(name => {
                    res.setHeader(name, page.httpHeaders[name])
                })
                res.send(ReactDOMServer.renderToString(basePage(
                    page,
                    pageInitialState,
                    { cssChecksum, bundleJsChecksum}
                )))
            })
            .catch(next)
    } else {
        next()
    }
})

server.post('/checkout', bodyParser.urlencoded({extended: true}), (req, res, next) => {
    const shoppingCart = JSON.parse(req.body['shopping-cart'])
    const customerId = req.cookies['customer-id'] || Math.random()
    res.cookie('customer-id', customerId)
    database
        .persistShoppingCart(shoppingCart, customerId)
        .then(() => {
            res.redirect(`/checkout`)
        })
})

server.post('/place-order', (req, res, next) => {
    database
        .clearShoppingCart(req.cookies['customer-id'])
        .then(() => {
            res.redirect(`/checkout-completed`)
        })
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

const checksumPromise = filePath =>
    new Promise((resolve, reject) => {
        require('fs').readFile(filePath, (error, fileContent) => {
            if (error) {
                reject(error)
            } else {
                resolve(crypto.createHash('md5').update(fileContent).digest('hex'))
            }
        })
    })

server.use((error, req, res, next) => {
    const message = error.stack || error.message || error
    const statusCode = error.statusCode || 500
    res.status(statusCode).send(message)
})

export const start = port => {
    const reportPages = () => {
        pages.allPages.forEach(({pagePath}) => {
            console.log(`Page available at http://localhost:${port}${pagePath}`)
        })
    }
    return new Promise((resolve, reject) => {
        server.listen(port, resolve)
    }).then(reportPages)
}
