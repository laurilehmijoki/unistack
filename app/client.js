import React from 'react'
React.initializeTouchEvents(true)
import * as pages from './pages/pages'
import basePage from './pages/basePage'

const currentPage = pages.findPage(document.location.pathname)

const App = React.createClass({
    componentWillMount: function() {
        currentPage
            .applicationStateProperty(window.INITIAL_STATE)
            .onValue(applicationState => this.replaceState(applicationState))
    },
    render: function() {
        return this.state ?
            basePage(currentPage, this.state, window.CHECKSUMS)
            :
            <span>Loading...</span>
    }
})

React.render(<App/>, document)
