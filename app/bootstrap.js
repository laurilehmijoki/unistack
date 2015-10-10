require('./augmentRuntime')

require('./server').start(process.env.PORT || 4000)
