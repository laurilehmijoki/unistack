export const allPages = [
    require('./bookMovieTickets')
]

export const findPage = path =>
    allPages.filter(({pagePaths}) =>
        pagePaths
            .map(pagePath => {
                const pathRegExp = pagePath instanceof RegExp ? pagePath : new RegExp(`^${pagePath}$`)
                return pathRegExp.test(path)
            })
            .filter(pagePathMatches => pagePathMatches == true).length > 0

    )[0]