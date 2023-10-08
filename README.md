
Rebuild of [Vue CRUD application](https://github.com/shershen08/vue.js-v2-crud-application) with [Nuxt 3](https://nuxtjs.org) and [Pinia](https://pinia.vuejs.org).
Demo on https://codepen.io/shershen08/pen/xROOxw

## Instructions

- install yarn (or pnpm)
- git clone this repostory
- cd vue-crud-nuxt
- cd frontend
- yarn install --frozen-lockfile
- yarn run dev
- open browser http://127.0.0.1:3000/

It can also run without node on a static website:
- ./node-modules/.bin/nuxt generate

or install nuxt globally with
- sudo npm install -g nuxt

and run:
- nuxt generate

  This creates everything in the .output/public directory.
  Put it in the document root directory of your webserver, or test it for example with live-server
  - sudo npm install -g live-server
  - cd .output/public
  - live-server
  - open browser http://127.0.0.1:8080/

