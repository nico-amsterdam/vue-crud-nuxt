
Rebuild of [Vue CRUD application](https://github.com/shershen08/vue.js-v2-crud-application) with [Nuxt](https://nuxtjs.org).
Demo on https://codepen.io/shershen08/pen/xROOxw

## Instructions

- install yarn (or pnpm)
- git clone this repostory
- cd vue-crud-nuxt
- cd frontend
- yarn install
- yarn run dev
- open browser http://127.0.0.1:3000/

It can also run without node on a static website:
- ./node-modules/.bin/nuxt generate

or install nuxt globally with
- sudo yarn install -g nuxt

and run:
- nuxt generate

  This creates everything in the dist directory.
  Put it in the document root directory of your webserver, or test it for example with live-server
  - sudo yarn install -g live-server
  - cd dist
  - live-server

