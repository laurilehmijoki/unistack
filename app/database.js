import _ from 'lodash'

const productsPromise = new Promise((resolve, reject) => {
    require('fs').readFile(
        `${__dirname}/products.json`, // Source http://dbs.uni-leipzig.de/en/research/projects/object_matching/fever/benchmark_datasets_for_entity_resolution 
        (err, contents) => err ? reject(err) : resolve(contents)
    )
})
    .then(JSON.parse)
    .then(products => products.map((product, index) => ({
        ...product,
        id: index
    })))

export const productsGroupedByManufacturer = productsPromise.then(products => _.groupBy(products, 'manufacturer'))

export const searchProducts = query => productsPromise.then(
    products => products.filter(
        ({name, manufacturer, description}) => [name, manufacturer, description].find(
            (itemProperty = '') => new RegExp(query).test(itemProperty)
        ) 
    )
)

const shoppingCarts = {}

export const persistShoppingCart = (cart, customerId) => {
    shoppingCarts[customerId] = cart
    return Promise.resolve(customerId)
}

export const clearShoppingCart = customerId => {
    shoppingCarts[customerId] = undefined
    return Promise.resolve()
}

export const loadShoppingCart = customerId => {
    const cart = shoppingCarts[customerId]
    return cart ?
        Promise.resolve(cart)
        :
        Promise.reject({statusCode: 404, message: 'Cart not found'})
}