export const allPages = [
    require('./bookMovieTickets')
]

export const findPage = path =>
    allPages.filter(({pagePath}) => {
        const pathRegExp = pagePath instanceof RegExp ? pagePath : new RegExp(`^${pagePath}$`)
        return pathRegExp.test(path)
    })[0]