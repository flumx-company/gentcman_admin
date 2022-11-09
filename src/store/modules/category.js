import {
  getSubcategoryList,
  removeSubcategory,
  addSubcategory,
  updateSubcategory,
} from '@/api/subcategory'

export default {
  namespaced: true,
  state: {
    isUpdatePending: false,
    categoryDictionary: {
      1: { id: 1, title: 'Краса', subcategory: {} },
      2: { id: 2, title: 'Гігієна', subcategory: {} },
      3: { id: 3, title: 'Чистота', subcategory: {} },
    },
  },
  mutations: {
    setCategoryList(state, payload) {
      state.categoryDictionary = {
        ...state.categoryDictionary,
        ...payload.value,
      }
    },
    toggleIsUpdatePending(state, payload) {
      state.isUpdatePending = payload.value
    },
    removeCategory(state, payload) {
      const { id, category_id } = payload
      const newCategoryDictionary = { ...state.categoryDictionary }
      delete newCategoryDictionary[category_id].subcategory[id]
      state.categoryDictionary = { ...newCategoryDictionary }
    },
    updateCategory(state, payload) {
      const { id, category_id, subcategory } = payload
      const newCategoryDictionary = { ...state.categoryDictionary }

      newCategoryDictionary[category_id].subcategory[id].title = subcategory

      state.categoryDictionary = {
        ...newCategoryDictionary,
      }
    },
    addCategory(state, payload) {
      const { id, category_id, subcategory } = payload
      const newCategoryDictionary = { ...state.categoryDictionary }

      newCategoryDictionary[category_id].subcategory[id] = {
        id,
        category_id,
        title: subcategory,
      }
      state.categoryDictionary = { ...newCategoryDictionary }
    },
  },
  actions: {
    async setCategoryList(context) {
      const { data } = await getSubcategoryList()

      if (Array.isArray(data)) {
        const categoryDictionary = {}

        data.forEach((subcategoryListItem) => {
          const { id, category, category_id, subcategory } = subcategoryListItem

          if (!categoryDictionary[category_id]) {
            categoryDictionary[category_id] = {
              id: category_id,
              title: category,
              subcategory: {},
            }
          }

          categoryDictionary[category_id].subcategory[id] = {
            title: subcategory,
            id,
            category_id,
            category,
          }
        })

        context.commit('setCategoryList', {
          value: categoryDictionary,
        })
      }
    },
    async removeCategory(context, payload) {
      const { id, category_id } = payload

      try {
        context.commit('toggleIsUpdatePending', {
          value: true,
        })

        const response = await removeSubcategory({ id })

        if (response.data.result) {
          context.commit('removeCategory', {
            id,
            category_id,
          })
        } else {
          throw 'Failed to remove category'
        }
        context.commit('toggleIsUpdatePending', {
          value: false,
        })
      } catch (e) {
        console.error(e)
      }
    },
    async addCategory(context, payload) {
      const { category_id, subcategory } = payload

      try {
        context.commit('toggleIsUpdatePending', {
          value: true,
        })

        const response = await addSubcategory({ category_id, subcategory })

        context.commit('addCategory', {
          id: response.data.result,
          category_id,
          subcategory,
        })
        context.commit('toggleIsUpdatePending', {
          value: false,
        })
      } catch (e) {
        console.error(e)
      }
    },

    async updateCategory(context, payload) {
      const { subcategory, category_id, id } = payload

      try {
        context.commit('toggleIsUpdatePending', {
          value: true,
        })

        const response = await updateSubcategory({
          id,
          category_id,
          subcategory,
        })

        if (response.data.result) {
          context.commit('updateCategory', {
            id,
            category_id,
            subcategory,
          })
        } else {
          throw 'Failed to update category'
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
    getCategoryList: (state) => {
      return (
        Object.values(state.categoryDictionary).map(
          ({ id, title, subcategory }) => {
            return {
              id,
              title,
              list: Object.values(subcategory),
            }
          },
        ) || []
      )
    },
    isUpdatePending: (state) => state.isUpdatePending,
    getCategorySelectItems: (_, getters) => {
      let subcategoryList = []

      getters.getCategoryList.forEach(({ list }) => {
        subcategoryList = subcategoryList.concat(list || [])
      })

      return subcategoryList.map(
        ({ category, title: subcategory, id: subcategory_id }) => ({
          text: `${category} / ${subcategory}`,
          value: subcategory_id,
        }),
      )
    },
  },
}
