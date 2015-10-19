/* @flow */
import React from 'react'

export default (page: Page, applicationState: ApplicationState, checksums: Checksums): ReactElement =>
    <html>
        <head>
            <link rel="stylesheet" href={`/style.css?checksum=${checksums.cssChecksum}`}/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>{page.pageTitle}</title>
            <script type="text/javascript" dangerouslySetInnerHTML={{__html: `
                window.INITIAL_STATE = ${JSON.stringify(applicationState)};
                window.CHECKSUMS = ${JSON.stringify(checksums)};
            `}}/>
            <script src={`/bundle.js?checksum=${checksums.bundleJsChecksum}`} async/>
        </head>
        {page.renderPage(applicationState)}
    </html>
