import {
  getProductList,
  removeProduct,
  addProduct,
  editProduct,
} from '@/api/product'

export default {
  namespaced: true,
  state: {
    isUpdatePending: false,
    productDictionary: {},
    productItemDictionary: {},
  },
  mutations: {
    setProductDictionary(state, payload) {
      state.productDictionary = payload.value
    },
    setProductItemDictionayr(state, payload) {
      state.productItemDictionary = payload.value
    },
    toggleIsUpdatePending(state, payload) {
      state.isUpdatePending = payload.value
    },
    removeProduct(state, payload) {
      const { id, subcategory_id } = payload
      const newProductDictionary = { ...state.productDictionary }
      delete newProductDictionary[subcategory_id].list[id]
      state.productDictionary = { ...newProductDictionary }
    },
  },
  actions: {
    async setProductList(context) {
      const { data } = await getProductList()

      if (Array.isArray(data)) {
        const productDictionary = {}
        const productItemDictionary = {}

        data.forEach((productListItem) => {
          const {
            id,
            category_id,
            subcategory,
            subcategory_id,
            product,
            description,
            purchase_link,
            media,
          } = productListItem

          if (!productDictionary[subcategory_id]) {
            productDictionary[subcategory_id] = {
              category_id,
              subcategory_id,
              subcategory,
              list: {},
            }
          }

          productDictionary[subcategory_id].list[id] = {
            id,
            image: `${process.env.VUE_APP_HOST}/file/${media?.filename}`,
            title: product,
            description,
            purchaseLink: purchase_link,
            category_id,
            subcategory,
            subcategory_id,
            media,
          }

          productItemDictionary[id] = productListItem
        })

        context.commit('setProductDictionary', {
          value: productDictionary,
        })

        context.commit('setProductItemDictionayr', {
          value: productItemDictionary,
        })
      }
    },
    async removeProduct(context, payload) {
      const { id, subcategory_id } = payload

      try {
        context.commit('toggleIsUpdatePending', {
          value: true,
        })

        const response = await removeProduct({ id })

        if (response.data.result) {
          context.commit('removeProduct', {
            id,
            subcategory_id,
          })
        } else {
          throw 'Failed to remove product'
        }

        context.commit('toggleIsUpdatePending', {
          value: false,
        })
      } catch (e) {
        console.error(e)
      }
    },
    async updateProduct(context, payload) {
      const { formData, id } = payload

      try {
        context.commit('toggleIsUpdatePending', {
          value: true,
        })

        let response
        if (Number.isFinite(id)) {
          response = await editProduct({
            formData,
            id,
          })
        } else {
          response = await addProduct({
            formData,
          })
        }

        if (Number.isFinite(response.data.result)) {
          context.dispatch('setProductList')
        } else {
          throw 'Failed to add product'
        }

        context.commit('toggleIsUpdatePending', {
          value: false,
        })
      } catch (e) {
        console.error(e)
      }
    },
  },
  getters: {
    getProductDictionary: (state) => state.productItemDictionary,
    getProductList: (state) => {
      return (
        Object.values(state.productDictionary).map(
          ({ category_id, subcategory, subcategory_id, list }) => ({
            category_id,
            subcategory_id,
            subcategory,
            list: Object.values(list),
          }),
        ) || []
      )
    },
    isUpdatePending: (state) => state.isUpdatePending,
  },
}
