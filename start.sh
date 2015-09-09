#!/bin/bash -e

npm install

if [ "$NODE_ENV" == "production" ]; then
  node_modules/node-sass/bin/node-sass --output-style=compressed app/scss/style.scss --output .generated
  node_modules/browserify/bin/cmd.js --entry app/client.js | node_modules/uglify-js/bin/uglifyjs --compress --mangle > .generated/bundle.js
  node_modules/.bin/forever app/bootstrap.js
else
  node_modules/watchify/bin/cmd.js app/client.js \
    --debug \
    -o .generated/bundle.js \
    -v \
    &

  node_modules/nodemon/bin/nodemon.js \
    --quiet \
    --exec "node_modules/node-sass/bin/node-sass app/scss/style.scss --output-style=compressed --output .generated" \
    --include-path="app" \
    --ext scss &

  node_modules/supervisor/lib/cli-wrapper.js --quiet --ignore node_modules --watch app app/bootstrap.js
fi
