import React from 'react'

export const Product = ({product, productCount, key}) =>
    <li className="product" key={key}>
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