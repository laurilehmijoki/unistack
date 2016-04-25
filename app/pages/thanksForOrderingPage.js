import React from 'react'
import Bacon from 'baconjs'

export const renderPage = applicationState =>
    <body>
        <header className="header">
            <h1>Thanks!</h1>
        </header>
        <main className="main">
            <h2>The products will soon appear on your front door.</h2>
        </main>
    </body>


export const initialState = () => ({})

export const pagePath = new RegExp('^/checkout-completed')

export const pageTitle = applicationState => 'Thanks for ordering!'

export const applicationStateProperty = initialState => Bacon.update(
    initialState
).doLog('application state')