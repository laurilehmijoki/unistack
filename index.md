---
title: Unistack
layout: default
---

# Unistack

Unistack is a starter kit for building web applications with Node.js, React and
Bacon.js.

## Features

Unistack contains a set of tools that let you skip the tedious process of
setting up a new software project:

* Convenient HTTP routing both on the server and client
* ECMAScript 6 and 7
* SASS
* Browserify
* production-ready build
  * automatic minification of the generated CSS and JavaScript files
  * cache-busted CSS and JavaScript resources
  * deploy to Heroku or AWS Elastic Beanstalk without extra configuration
* developer build
  * incremental Browserify build
  * SASS re-compilation on file change
  * automatic restart of the Node.js server when needed

## How to start a new webapp project with Unistack

    git clone https://github.com/laurilehmijoki/unistack.git /tmp/my-new-project
    cd /tmp/my-new-project
    rm -rf /tmp/my-new-project/.git
    git init
    git add --all
    git commit -m "Initial commit"
    npm start

