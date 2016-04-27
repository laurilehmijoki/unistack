---
title: Unistack examples
layout: default
permalink: examples.html
---

## Online shop

Features

* Database integration
* Multiple pages
* Cookies

### Live demo

<https://unistack-example-online-shop.herokuapp.com/>

### Source code

The full source code of the example is [here](https://github.com/laurilehmijoki/unistack/tree/examples/online-shop).

## Book movie tickets

Features

* In-app routing with `history.pushState`
* Database integration

### Usage

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/laurilehmijoki/unistack/tree/examples/book-movie-tickets)

or

    mkdir -p /tmp/unistack-examples
    git clone --branch examples/book-movie-tickets https://github.com/laurilehmijoki/unistack.git /tmp/unistack-examples/book-movie-tickets
    cd /tmp/unistack-examples/book-movie-tickets
    npm start

### Source code

The most relevant file is
[bookMovieTickets.js](https://github.com/laurilehmijoki/unistack/blob/examples/book-movie-tickets/app/pages/bookMovieTickets.js).

The comparison with master is [here](https://github.com/laurilehmijoki/unistack/compare/master...examples/book-movie-tickets).

The full source code of the example is [here](https://github.com/laurilehmijoki/unistack/tree/examples/book-movie-tickets).

<hr/>

## Testing with Zombie

Features

* Integrate [Zombie](http://zombie.js.org) with Unistack

### Usage

    mkdir -p /tmp/unistack-examples
    git clone --branch examples/zombie-testing https://github.com/laurilehmijoki/unistack.git /tmp/unistack-examples/zombie-testing
    cd /tmp/unistack-examples/zombie-testing
    npm test

### Source code

The most relevant file is
[test.js](https://github.com/laurilehmijoki/unistack/blob/examples/zombie-testing/test/test.js).

The comparison with master is [here](https://github.com/laurilehmijoki/unistack/compare/master...examples/zombie-testing).

The full source code of the example is [here](https://github.com/laurilehmijoki/unistack/tree/examples/zombie-testing).
