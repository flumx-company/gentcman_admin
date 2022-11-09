import { login } from '@/api/auth'
import { getUserData } from '@/api/user'

const initialState = {
  isAuthorized: false,
  id: null,
  email: '',
  phone: '',
}

export default {
  namespaced: true,
  state: initialState,
  mutations: {
    updateUser(state, payload) {
      for (let key in payload || {}) {
        state[key] = payload[key]
      }
    },
  },
  actions: {
    async login(context, payload) {
      const { email, password } = payload

      try {
        const { data } = await login({ email, password })
        localStorage.setItem('jwt', data.token)

        if (!data.id) {
          context.commit('updateUser', {
            email,
            id: data.id,
            isAuthorized: true,
            error: '',
          })
        }
      } catch (e) {
        if (e?.response?.data?.error) {
          context.commit('updateUser', { error: e?.response?.data?.error })
        }
      }
    },
    async updateUserData(context) {
      try {
        const { data } = await getUserData()

        context.commit('updateUser', data)
      } catch (e) {
        console.error(e)
      }
    },
    async logout(context) {
      try {
        context.commit('updateUser', { ...initialState })
        localStorage.removeItem('jwt')
      } catch (e) {
        console.error(e)
      }
    },
  },
}
