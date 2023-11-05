import {createStore} from 'vuex'

export default createStore({
    state: {
        STATE_META_DATA: null,
        STATE_ROW_MEASURE: [],
        STATE_COL_MEASURE: [],
        STATE_METRICS: []
    },
    getters: {
        META_DATA: state => {
            return state.STATE_META_DATA
        },
        ROW_MEASURE: state => {
            return state.STATE_ROW_MEASURE
        },
        COl_MEASURE: state => {
            return state.STATE_COL_MEASURE
        },
        METRICS: state => {
            return state.STATE_METRICS
        }
    },
    mutations: {
        SET_META_DATA: (state, payload) => {
            state.STATE_META_DATA = payload
        },
        ADD_ROW_MEASURE: (state, payload) => {
            state.STATE_ROW_MEASURE.push(payload)
        },
        ADD_COL_MEASURE: (state, payload) => {
            state.STATE_COL_MEASURE.push(payload)
        },
        ADD_METRIC: (state, payload) => {
            state.STATE_METRICS.push(payload)
        },
        DELETE_ROW_MEASURE: (state, payload) => {
            state.STATE_ROW_MEASURE = state.STATE_ROW_MEASURE.filter(item => item.fieldId !== payload)
        },
        DELETE_COL_MEASURE: (state, payload) => {
            state.STATE_COL_MEASURE = state.STATE_COL_MEASURE.filter(item => item.fieldId !== payload)
        },
        DELETE_METRIC: (state, payload) => {
            state.STATE_METRICS = state.STATE_METRICS.filter(item => item.field.fieldId !== payload)
        }
    }
})