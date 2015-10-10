# Learn Bacon.js and React with Unistack

## Connect Bacon.js and React

### Introduction

In this excercise we'll build an application that keeps a count of a number. In our application the user can either
increment the counter or double it.

### The objective

The counter buttons lack an implementation. Your assignment is to make them work.

After this excercise you will have a basic understanding of how to connect React and Bacon.js to each other.

### Tips

1. clone this git repository onto your own computer
1. start the application with `npm start`
1. Open the file *frontPage.js*
1. Create two HTML buttons
  * One button for incrementing the counter by 1
  * Another button for doubling the counted number.
1. Assign the attributes `id="increment-counter"` and `id="double-counter"` to the buttons
  * The assignment checker will need these attributes to verify your answer 
1. Add `export const countBus = new Bacon.Bus()` into the file
  * The keyword `export` is required only for the assignment checker to verify that your answer is correct
1. Add to the increment button the attribute `onClick={() => countBus.push(applicationState.count + 1)}`
1. Add to the double button the attribute `onClick={() => countBus.push(applicationState.count * 2)}`
1. Bind the `countBus` into the `applicationStateProperty`:
  * Do the binding by adding the following line as the last argument of the `Bacon.update` invocation:
    * `countBus, (applicationState, count) => ({...applicationState, count})`
 
 
Verify your answer by running `npm test`. 