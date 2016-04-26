import React from 'react'
import Bacon from 'baconjs'
import _ from 'lodash'
import classnames from 'classnames'
import * as shoppingCart from '../components/shoppingCart/shoppingCart'

export const renderPage = applicationState =>
    <body>
        <header className="header">
            <h1>Checkout</h1>
        </header>
        <main className="main">
            <ul>
                {
                    _(applicationState.shoppingCart).groupBy('id').map((products, id) => {
                        const productCount = products.length
                        const product = products[0]
                        return (
                            <li className="product" key={id}>
                                <span className="product__name">{product.name}</span>
                                {product.manufacturer ?
                                    <span className="product__manufacturer">By {product.manufacturer}</span>
                                    :
                                    undefined
                                }
                                <span className="product__description">{product.description}</span>
                                <span className="product__checkout-summary">
                                    <span className="product__price">
                                        {productCount} <i className="fa fa-times"/> {product.price} = $ {productCount * product.price}
                                    </span>
                                </span>
                            </li>
                        )
                    }).value()
                }
            </ul>
            <form className="checkout__form" method="post" action="/place-order" onSubmit={evt => {
                if (formIsValid(applicationState)) {
                    shoppingCart.clear()
                } else {
                    evt.preventDefault()
                }
            }}>
                <input
                    type="text"
                    placeholder="Your name"
                    value={applicationState.formState.customerName}
                    onChange={onFormValueChanged('customerName')}/>
                <input
                    type="text"
                    placeholder="Credit card number"
                    value={applicationState.formState.creditCardNumber}
                    onChange={onFormValueChanged('creditCardNumber')}/>
                <button className={classnames({ 'valid': formIsValid(applicationState)})}>
                    Place order
                </button>
            </form>
        </main>
    </body>

const formIsValid = applicationState =>
    applicationState.formState.customerName && applicationState.formState.customerName.length > 2 &&
    applicationState.formState.creditCardNumber && applicationState.formState.creditCardNumber.replace(/\s/g, '').match("^\\d{16}$")

const onFormValueChanged = name => event => formValueChangedBus.push({
    name,
    value: event.target.value
})

const formValueChangedBus = new Bacon.Bus()

export const initialState = ({database, cookies}) => Promise.all([
    database.loadShoppingCart(cookies['customer-id'])
]).then(([shoppingCart]) => ({
    shoppingCart,
    formState: {
        customerName: '',
        creditCardNumber: ''
    }
}))

export const pagePath = '/checkout'

export const httpHeaders = {
    'cache-control': 'no-cache, no-store, must-revalidate, max-age=0'
}

export const pageTitle = applicationState => 'Checkout'

export const applicationStateProperty = initialState => Bacon.update(
    initialState,
    formValueChangedBus, (applicationState, {name, value}) => ({
        ...applicationState,
        formState: {
            ...applicationState.formState,
            [name]: value
        }
    })
).doLog('application state')