import { getSocialNetworkList } from '@/api/socialNetwork'

export default {
  namespaced: true,
  state: {
    socialNetworkDictionary: {},
  },
  mutations: {
    setSocialNetworkDictionary(state, payload) {
      state.socialNetworkDictionary = payload.value
    },
  },
  actions: {
    async setUserList(context) {
      const { data } = await getSocialNetworkList()

      if (Array.isArray(data)) {
        const socialNetworkDictionary = {}

        data.forEach(({ id, ...socialNetwork }) => {
          socialNetworkDictionary[id] = {
            id,
            ...socialNetwork,
          }
        })

        context.commit('setSocialNetworkDictionary', {
          value: socialNetworkDictionary,
        })
      }
    },
  },
  getters: {
    getSocialNetworkList: (state) => {
      return Object.values(state.socialNetworkDictionary)
    },
  },
}
