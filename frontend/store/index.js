
export const state = () => ({
      products: [
          {id: 1, name: 'Drill', description: 'Drill it', price: 35, features: [{id: 51, name: 'Handy'}, {id:52, name: 'Tool'}]}
        , {id: 2, name: 'Hammer', description: 'Nail it', price: 10, features: [{id: 51, name: 'Handy'}, {id:52, name: 'Tool'}]}
        , {id: 3, name: 'Handsaw', description: 'Saw it', price: 55, features: [{id: 51, name: 'Handy'}, {id:52, name: 'Tool'}]}
        , {id: 4, name: 'Scissors', description: 'Cut it', price: 5, features: [{id: 51, name: 'Handy'}, {id:52, name: 'Tool'}]}
        , {id: 5, name: 'Screwdriver', description: 'Screw it', price: 10, features: [{id: 51, name: 'Handy'}, {id:52, name: 'Tool'}]}
      ]
})

export const mutations = {
      ADD_PRODUCT (state, product) {
        console.log('add ' + product.name);
        // get the id's of all products
        let ids = state.products.map( (prod) => prod.id );
        // when there are no id's yet, 0 is the max.
        ids.push(0);  
        // calculate new id
        let newId = Math.max(...ids) + 1;
        state.products.push({
            id: newId
          , name: product.name
          , description: product.description
          , price: product.price
        });
      },
      UPDATE_PRODUCT (state, product) {
        let found = state.products.find(p => p.id === product.id);
        console.log('update '  + found.name);
        found.name = product.name
        found.description = product.description
        found.price = product.price
      },
      DELETE_PRODUCT (state, product) {
        let foundIndex = state.products.findIndex(p => p.id === product.id);
        console.log('delete ' + product.name);
        if (foundIndex !== -1) state.products.splice(foundIndex, 1);
      }
}

export const actions = {
      // to wait for the result, return a Promise.
      // You generally want this, if the (validation-) result decides the navigation.
      // You don't have to wait if add-product and list is on the same page.
      addProduct({commit}, product) {
        new Promise((resolve) => setTimeout(resolve, 2000)).then( () => {
        console.log('add1')
        commit('ADD_PRODUCT', product) 
        })
      },
      // just for the demo of nuxtServerInit
      nuxtServerInit ({ commit }, { req }) {
        commit('ADD_PRODUCT', {name: 'Wire cutters', description: 'Cut the wire', price: 40, features: [{id: 51, name: 'Handy'}, {id:52, name: 'Tool'}]})
      }
}

