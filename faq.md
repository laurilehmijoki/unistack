---
title: Unistack FAQ
layout: default
---

## Why Unistack exists?

Without Unistack, it can be tedious to set up a new Bacon.js+React software project.

## Why Unistack uses Bacon.js?

Bacon.js contains a comprehensive set of tools for modelling asynchronous
programs. Most programming problems in web applications involve asynchronicity.
Hence, Bacon.js is a useful tool for webapp programming.

How Bacon.js tackles asynchronicity? Please continue reading.

Bacon.js incorporates ideas from the world of functional programming. In
functional programming, state-management problems are either absent or strictly
cornered into the periphery of the application. This tactic removes a large
class of bugs, the bugs that emerge from state management. Furthermore, Bacon.js
has excellent support for composition. Composition allows the programmer to
split the program into reusable fractions.

In addition to functional programming, Bacon.js leverages the ideas of reactive
programming. In reactive programming the world is modelled through events and
reactions to those events. This turns out to be a useful way of constructing
software programs, because the real world is full of events and actors that
react to those events. It follows that a programmer can maintain a coherent
relationship between the real world and the software she is writing, when she
thinks in terms of events and reactions.

## Why Unistack uses React

Facebook React is a tool that takes away the burden of reflecting the
changes in the application state to the view. In other words, React lets the
programmer to simply describe the desired view as a function of data, and React
will take care of applying the changes to the underlying view API, which in the
case of web application programming is the browser's DOM API.

In summary, thanks to React, the programmer is relieved of the cumbersome task
of synching the application state to the view layer. This is a big deal!

## Why Unistack uses both React and Bacon.js?

React and Bacon.js complement each other well: React excels at the view layer,
whereas Bacon.js offers good tools to modelling asynchronous software.

With both React and Bacon.js onboard, Unistack offers a comprehensive set of
tools for solving common problems in web application programming.

## Are there alternatives to Bacon.js?

Yes there are. For example RxJS. If you are familiar with RxJS, you should be
able to replace Bacon.js with RxJS in Unistack.
