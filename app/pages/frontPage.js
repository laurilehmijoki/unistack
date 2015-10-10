import React from 'react'
import Bacon from 'baconjs'

export const renderPage = applicationState =>
    <body>
        <h1>hello unistack!</h1>
        <button onClick={() => buttonClickedBus.push()}>
            click me
        </button>
        <div id="clicks">{applicationState.clicks}</div>
    </body>

export const initialState = {
    clicks: 0
}

export const pagePath = '/'

export const pageTitle = 'Unistack'

const buttonClickedBus = new Bacon.Bus()
export const applicationStateProperty = initialState => Bacon.update(
    initialState,
    buttonClickedBus, applicationState => ({...applicationState, clicks: applicationState.clicks + 1})
).doLog('application state')
