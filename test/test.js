require('../app/augmentRuntime')
import Browser from 'zombie'
import * as server from '../app/server'

const serverPort = 3999
server.start(serverPort).then(run)

Browser.localhost('localhost', serverPort)

context('User visits the front page', () => {
    const browser = new Browser()
    before((done) => {
        browser.visit('/', done)
    })

    describe('button click', () => {
        before((done) => {
            browser.pressButton('click me', done)
        })

        it('increments the click count', () => {
            browser.assert.text('#clicks', '1')
        })
    })
})