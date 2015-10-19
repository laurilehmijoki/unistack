/* @flow */
import React from 'react'
import Bacon from 'baconjs'

export const renderPage = (applicationState: ApplicationState): ReactElement =>
    <body>
        <h1>hello unistack!</h1>
        <button onClick={() => buttonClickedBus.push()}>
            click me
        </button>
        <div>{applicationState.clicks}</div>
    </body>

export const initialState: InitialState = {
    clicks: 0
}

export const pagePath: string = '/'

export const pageTitle: string = 'Unistack'

const buttonClickedBus = new Bacon.Bus()
export const applicationStateProperty = (initialState: InitialState): Bacon.Property => Bacon.update(
    initialState,
    buttonClickedBus, applicationState => ({...applicationState, clicks: applicationState.clicks + 1})
).doLog('application state')
