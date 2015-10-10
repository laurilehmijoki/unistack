require('../app/augmentRuntime')
import Browser from 'zombie'
import * as server from '../app/server'
import * as assert from 'assert'
import Bacon from 'baconjs'

const serverPort = 3999
server.start(serverPort).then(run)

Browser.localhost('localhost', serverPort)

context('level 1', () => {
    const browser = new Browser()
    before((done) => {
        browser.visit('/', done)
    })

    describe('countBus', () => {
        it('is exported', () => {
            browser.assert.evaluate('window.frontPage.countBus !== undefined')
        })

        it('is instance of Bacon.Bus', () => {
            browser.assert.evaluate('window.frontPage.countBus instanceof Bacon.Bus')
        })
    })

    describe('increment button', () => {
        it('has the correct id', () => {
            browser.assert.element('#increment-counter')
        })
    })

    describe('double button', () => {
        it('has the correct id', () => {
            browser.assert.element('#double-counter')
        })
    })

    describe('presses on the buttons', () => {
        var expectedCount = 0
        var buttonPresses = 0
        before(() => {
            browser.evaluate('window.countValues = []')
            browser.evaluate('window.frontPage.countBus.onValue(function(count) { countValues.push(count)})')
        })

        context('the user presses the double button', () => {
            before((done) => {
                browser.pressButton('#double-counter', done)
                buttonPresses++
            })

            it('does not double the count, because initially the count is zero', () => {
                browser.assert.text('#count', expectedCount.toString())
            })

            it('emits the button click event via the countBus', () => {
                browser.assert.evaluate('window.countValues[0]', 0)
            })
        })

        context('the user presses the increment button', () => {
            before((done) => {
                browser.pressButton('#increment-counter', done)
                buttonPresses++
                expectedCount++
            })

            it('increments the count', () => {
                browser.assert.text('#count', expectedCount.toString())
            })

            it('emits the button click event via the countBus', () => {
                browser.assert.evaluate('window.countValues[1]', expectedCount)
            })
        })

        context('the user presses the double button several times', () => {
            ['click', 'click', 'click'].forEach(() => {
                before((done) => {
                    browser.pressButton('#double-counter', done)
                    buttonPresses++
                    expectedCount = expectedCount * 2
                })

                it('doubles the count on every button press', () => {
                    browser.assert.text('#count', expectedCount.toString())
                })

                it('emits the button click event via the countBus', () => {
                    browser.assert.evaluate(`window.countValues[${buttonPresses-1}]`, expectedCount)
                })
            })
        })
    })
})