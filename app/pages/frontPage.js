import React from 'react'
import Bacon from 'baconjs'

export const renderPage = applicationState =>
    <body>
        <h1>Counter application</h1>
        <button>
            increment the count
        </button>
        <button>
            double the count
        </button>
        <div id="count">{applicationState.count}</div>
    </body>

export const initialState = {
    count: 0
}

export const pagePath = '/'

export const pageTitle = 'Unistack'

export const applicationStateProperty = initialState => Bacon.update(
    initialState
).doLog('application state')
