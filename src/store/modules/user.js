import { getUserList } from '@/api/user'
import { getVoteList } from '@/api/vote'
import { getSubscriptionList } from '@/api/subscription'

export default {
  namespaced: true,
  state: {
    userDictionary: {},
  },
  mutations: {
    setUserDictionary(state, payload) {
      state.userDictionary = payload.value
    },
  },
  actions: {
    async setUserList(context) {
      const { data: userData } = await getUserList()
      const { data: voteData } = await getVoteList()
      const { data: subcriptionData } = await getSubscriptionList()

      if (Array.isArray(userData)) {
        const userDictionary = {}

        userData.forEach(({ id, email, created_at, phone, goals }) => {
          userDictionary[id] = {
            id,
            email,
            created_at,
            phone,
            goals,
            subcategory: {},
            subscription: {},
          }
        })

        if (Array.isArray(voteData)) {
          voteData.forEach(
            ({ subcategory_id, user_id, product_id, created_at, votes_created_at }) => {
              userDictionary[user_id].subcategory[subcategory_id] = {
                product_id,
                created_at,
                votes_created_at
              }
            },
          )
        }

        if (Array.isArray(subcriptionData)) {
          subcriptionData.forEach(
            ({ user_id, social_network_id, created_at }) => {
              userDictionary[user_id].subscription[social_network_id] = {
                social_network_id,
                created_at,
              }
            },
          )
        }

        context.commit('setUserDictionary', {
          value: userDictionary,
        })
      }
    },
  },
  getters: {
    getUserList: (state) => {
      return Object.values(state.userDictionary)
    },
  },
}
