
Rebuild of [Vue CRUD application](https://github.com/shershen08/vue.js-v2-crud-application) with [Nuxt](https://nuxtjs.org).
Demo on https://codepen.io/shershen08/pen/xROOxw

## Instructions

- install npm
- git clone this repostory
- cd vue-crud-nuxt
- cd frontend
- npm ci
- npm run dev
- open browser http://127.0.0.1:4000/

It can also run without node on a static website:
- ./node-modules/.bin/nuxt generate

or install nuxt globally with
- sudo npm install -g nuxt

and run:
- nuxt generate

  This creates everything in the dist directory.
  Put it in the document root directory of your webserver, or test it for example with live-server
  - sudo npm install -g live-server
  - cd dist
  - live-server

