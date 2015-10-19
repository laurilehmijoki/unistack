/* @flow */
import React from 'react'
import ReactDOM from 'react-dom'
import * as pages from './pages/pages'
import basePage from './pages/basePage'

const currentPage: Page = pages.findPage(document.location.pathname)

const App = React.createClass({
    componentWillMount: function() {
        currentPage
            .applicationStateProperty(window.INITIAL_STATE)
            .onValue((applicationState: ApplicationState) => this.replaceState(applicationState))
    },
    render: function() {
        const state: any = this.state
        const applicationState: ?ApplicationState = state
        return applicationState ?
            basePage(currentPage, applicationState, window.CHECKSUMS)
            :
            <span>Loading...</span>
    }
})

window.onload = () => ReactDOM.render(<App/>, document)
