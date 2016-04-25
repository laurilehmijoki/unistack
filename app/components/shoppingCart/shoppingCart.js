import Bacon from 'baconjs'

export const persistToShoppingCart = product => {
    const nextCart = loadShoppingCart().concat(product)
    localStorage.setItem('shopping-cart',
        JSON.stringify(nextCart)
    )
    shoppingCartPersisted.push()
}

export const loadShoppingCart = () => {
    const persistedCart = localStorage.getItem('shopping-cart')
    console.log(persistedCart)
    return persistedCart ? JSON.parse(persistedCart) : []
}

export const shoppingCartPersisted = new Bacon.Bus()

export const clear = () => {
    console.log('clear')
    localStorage.removeItem('shopping-cart')
}