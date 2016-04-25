import React from 'react'

export default (page, applicationState, checksums) =>
    <html>
        <head>
            <link rel="stylesheet" href={`/style.css?checksum=${checksums.cssChecksum}`}/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>{page.pageTitle(applicationState)}</title>
            <script type="text/javascript" dangerouslySetInnerHTML={{__html: `
                window.CHECKSUMS = ${JSON.stringify(checksums)};
            `}}/>
            <script src={`/bundle.js?checksum=${checksums.bundleJsChecksum}`} async/>
            <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css"/>
        </head>
        {(() => {
            const pageReactElement = page.renderPage(applicationState)
            pageReactElement.props.children.push(
                <div id="applicationState" data-state={JSON.stringify(applicationState)} style={{display: 'none'}}/>
            )
            return pageReactElement
        })()}
    </html>
