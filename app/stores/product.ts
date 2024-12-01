import { defineStore } from 'pinia'
import { ref } from 'vue'

type FeatureType = {
  id: number;
  name: string;
}

type ProductBaseType = {
  name: string;
  description: string;
  price: number | null;
  features: Array<FeatureType>;
}

type ProductType = {id: number} & ProductBaseType
type AddProductType = {id: number | null} & ProductBaseType


export const useProductStore = defineStore('productStore', () => {

  const productList = ref<ProductType[]>([
    {id: 1, name: 'Drill', description: 'Drill it', price: 35, features: [{id: 51, name: 'Handy'}, {id:52, name: 'Tool'}]}
    , {id: 2, name: 'Hammer', description: 'Nail it', price: 10, features: [{id: 51, name: 'Handy'}, {id:52, name: 'Tool'}]}
    , {id: 3, name: 'Handsaw', description: 'Saw it', price: 55, features: [{id: 51, name: 'Handy'}, {id:52, name: 'Tool'}]}
    , {id: 4, name: 'Scissors', description: 'Cut it', price: 5, features: [{id: 51, name: 'Handy'}, {id:52, name: 'Tool'}]}
    , {id: 5, name: 'Screwdriver', description: 'Screw it', price: 10, features: [{id: 51, name: 'Handy'}, {id:52, name: 'Tool'}]}
  ])

  function addProduct(product: AddProductType) {
    console.log('add ' + product.name)
    // get the id's of all products
    const ids: (number)[] = productList.value.map( (prod) => prod.id )
    // when there are no id's yet, 0 is the max.
    ids.push(0)
    // calculate new id
    const newId = Math.max(...ids) + 1
    productList.value.push({
        id: newId
      , name: product.name
      , description: product.description
      , price: product.price
      , features: []
    })
  }

  function updateProduct(product: ProductType) {
    const found = productList.value.find(p => p.id === product.id)
    if (found) {
      console.log('update '  + found.name)
      found.name = product.name
      found.description = product.description
      found.price = product.price
    }
  }

  function deleteProduct(product: ProductType) {
    const foundIndex = productList.value.findIndex(p => p.id === product.id);
    console.log('delete ' + product.name)
    if (foundIndex !== -1) productList.value.splice(foundIndex, 1)
  }

  return { addProduct, updateProduct, deleteProduct, productList }
})
