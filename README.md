# Unistack

Unistack is a starter kit for building web applications.

## Features

* [Universal JavaScript](https://medium.com/@mjackson/universal-javascript-4761051b7ae9)
* [Unidirectional data flow](https://facebook.github.io/flux/docs/overview.html#structure-and-data-flow)

## Key technologies

* Node.js
* React
* Bacon.js

## Dev

    npm start

## Production deployment
    
Heroku provides an easy way to deploy a unistack application.

First, create a heroku application:
    
    heroku create # Assumes that you have the Heroku toolbelt installed
     
Then deploy with
     
    git push heroku master

## How to start a new webapp project with Unistack

    git clone https://github.com/laurilehmijoki/unistack.git /tmp/my-new-project 
    cd /tmp/my-new-project
    rm -rf /tmp/my-new-project/.git
    git init
    git add --all
    git commit -m "Initial commit" 
    npm start
    
### How to add a new page into a Unistack project
    
    npm install 
    ./create-new-route
    