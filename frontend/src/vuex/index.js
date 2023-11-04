import {createStore} from 'vuex'

export default createStore({
    state: {
        STATE_META_DATA: null,
        STATE_ROW_MEASURE: [],
        STATE_COL_MEASURE: [],
    },
    getters: {
        META_DATA: state => {
            return state.STATE_META_DATA
        },
        ROW_MEASURE: state => {
            return state.STATE_ROW_MEASURE
        }
    },
    mutations: {
        SET_META_DATA: (state, payload) => {
            state.STATE_META_DATA = payload
        },
        ADD_ROW_MEASURE: (state, payload) => {
            state.STATE_ROW_MEASURE.push(payload)
        }
    }
})