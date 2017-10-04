import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      products: [
          {id: 0, name: 'Drill', description: 'Drill it', price: 35, features: ['Handy', 'Tool']}
        , {id: 1, name: 'Hammer', description: 'Nail it', price: 10, features: ['Handy', 'Tool']}
        , {id: 2, name: 'Handsaw', description: 'Saw it', price: 55, features: ['Handy', 'Tool']}
        , {id: 3, name: 'Scissors', description: 'Cut it', price: 5, features: ['Handy', 'Tool']}
        , {id: 4, name: 'Screwdriver', description: 'Screw it', price: 10, features: ['Handy', 'Tool']}
      ]
    },
    mutations: {
      ADD_PRODUCT (state, product) {
        console.log('add2');
        state.products.push({
            id: Math.random().toString().split('.')[1]
          , name: product.name
          , description: product.description
          , price: product.price
        });
      },
      UPDATE_PRODUCT (state, product) {
        console.log('update');
        var q = state.products.find(p => p.id === product.id);
        q = {
            id: product.id
          , name: product.name
          , description: product.description
          , price: product.price
        };
      },
      DELETE_PRODUCT (state, product) {
        console.log('delete');
        var found = state.products.find(p => p.id === product.id);
        state.products.splice(found, 1);
      }
    },
    actions: {
      nuxtServerInit ({ commit }, { req }) {
        commit('ADD_PRODUCT', {id: 5, name: 'Wire cutters', description: 'Cut the wire', price: 40, features: ['Handy', 'Tool']})
      }
    }
  })
}

export default createStore
