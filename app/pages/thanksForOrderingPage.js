import React from 'react'
import Bacon from 'baconjs'

export const renderPage = applicationState =>
    <body>
        <header className="header">
            <h1>Thanks!</h1>
        </header>
        <main className="main">
            <h2>The products will soon appear on your front door.</h2>
            <a href="https://github.com/laurilehmijoki/unistack/tree/examples/online-shop">
                <img style={{position: 'absolute', top: 0, right: 0, border: 0}}
                     src="https://camo.githubusercontent.com/652c5b9acfaddf3a9c326fa6bde407b87f7be0f4/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6f72616e67655f6666373630302e706e67"
                     alt="Fork me on GitHub"
                     data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_orange_ff7600.png"/>
            </a>
        </main>
    </body>


export const initialState = () => ({})

export const pagePath = new RegExp('^/checkout-completed')

export const pageTitle = applicationState => 'Thanks for ordering!'

export const applicationStateProperty = initialState => Bacon.update(
    initialState
).doLog('application state')