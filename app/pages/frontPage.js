import React from 'react'
import Bacon from 'baconjs'
import _ from 'lodash'
import {persistToShoppingCart, shoppingCartPersisted, loadShoppingCart} from '../components/shoppingCart/shoppingCart'

export const renderPage = applicationState =>
    <body>
        <header className="header">
            <h1>Shop</h1>
            <div className="shopping-cart">
                <i className="fa fa-shopping-cart"/>
                {
                    applicationState.shoppingCart.length > 0 ?
                        <span>
                            <span className="shopping-cart__count">
                                {applicationState.shoppingCart.length} items
                            </span>
                            <span className="shopping-cart__sum">
                                $ {
                                    applicationState.shoppingCart.reduce(
                                        (sum, {price}) => Math.round(sum + price),
                                        0
                                    )
                                }
                            </span>
                            <form
                                action="/checkout"
                                method="post"
                                id="checkout-form"
                                className="shopping-cart__checkout"
                                onClick={() => document.getElementById('checkout-form').submit()}>
                                <input type="hidden" name="shopping-cart" value={JSON.stringify(applicationState.shoppingCart)}/>
                                Checkout <i className="fa fa-arrow-right"/>
                            </form>
                        </span>
                        :
                        undefined
                }
            </div>
        </header>
        <main className="main">
            <h2>Top manufacturers</h2>
            <ul className="top-manufacturers">
            {
                applicationState.topManufacturers.map((manufacturer, key) =>
                    <li className="top-manufacturers__manufacturer" key={key}>
                        <a href={`/?q=${manufacturer}`}>{manufacturer}</a>
                    </li>
                )
            }
            </ul>
            {
                applicationState.searchResults.length > 0 ?
                    <div>
                        <h2>Search results</h2>
                        <ul className="search-results">
                            {
                                applicationState.searchResults.map((product, key) =>
                                    <li className="product" key={key}>
                                        <span className="product__name">{product.name}</span>
                                        {product.manufacturer ?
                                            <span className="product__manufacturer">By {product.manufacturer}</span>
                                            :
                                            undefined
                                        }
                                        <span className="product__description">{product.description}</span>
                                        <div className="product__price-container">
                                            <span className="product__price">$ {product.price}</span>
                                            <i 
                                                className="fa fa-cart-plus product__add-to-cart" 
                                                onClick={() => persistToShoppingCart(product)}
                                            />
                                            {(() => {
                                                const productsInCart = applicationState.shoppingCart.filter(
                                                    productInCart => productInCart.id === product.id
                                                )
                                                return productsInCart.length > 0 ?
                                                    <span className="product__add-to-cart__summary">
                                                        You have {productsInCart.length} of these products in your cart
                                                    </span>
                                                    :
                                                    undefined
                                            })()}    
                                        </div>
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                    :
                    undefined
            }
        </main>
    </body>

export const initialState = ({database, query}) =>
    Promise.all([
        database.productsGroupedByManufacturer.then(productsByManufacturer =>
            _(productsByManufacturer).keys().take(10).value()
        ),
        query && query.q ? database.searchProducts(query.q) : []
    ]).then(([topManufacturers, searchResults]) => ({
        topManufacturers,
        searchResults,
        shoppingCart: []
    }))

export const pagePath = new RegExp('^/(\\?.*)?$')

export const pageTitle = applicationState => 'All-in-one online shop'

export const applicationStateProperty = initialState => Bacon.update(
    initialState,
    Bacon.mergeAll(
        shoppingCartPersisted,
        Bacon.later(1) // Load the shopping cart after the initial rendering of the browser state. Otherwise server-client-sync will fail.
    ).map(loadShoppingCart), (applicationState, shoppingCart) => ({
        ...applicationState,
        shoppingCart
    })
).doLog('application state')
