import {createStore} from 'vuex'

export default createStore({
    state: {
        STATE_META_DATA: null,
        STATE_ROW_MEASURE: [],
        STATE_COL_MEASURE: [],
        STATE_METRICS: [],
        STATE_FILTERS: [],
        STATE_COLUMN_SORT: [],
        STATE_ROW_SORT: []
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
        },
        FILTERS_LIST: state => {
            return state.STATE_FILTERS
        },
        COLUMN_SORT: state => {
            return state.STATE_COLUMN_SORT
        },
        ROW_SORT: state => {
            return state.STATE_ROW_SORT
        }
    },
    mutations: {
        SET_META_DATA: (state, payload) => {
            state.STATE_META_DATA = payload
        },
        SET_ROW_MEASURES: (state, payload) => {
            state.STATE_ROW_MEASURE = payload
        },
        SET_COL_MEASURES: (state, payload) => {
            state.STATE_COL_MEASURE = payload
        },
        SET_COLUMN_SORT: (state, payload) => {
            state.STATE_COLUMN_SORT = [payload]
        },
        SET_ROW_SORT: (state, payload) => {
            state.STATE_ROW_SORT = [payload]
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
        ADD_FILTER: (state, payload) => {
          state.STATE_FILTERS.push(payload)
        },
        DELETE_ROW_MEASURE: (state, payload) => {
            state.STATE_ROW_MEASURE = state.STATE_ROW_MEASURE.filter(item => item.fieldId !== payload)
        },
        DELETE_COL_MEASURE: (state, payload) => {
            state.STATE_COL_MEASURE = state.STATE_COL_MEASURE.filter(item => item.fieldId !== payload)
        },
        DELETE_METRIC: (state, payload) => {
            state.STATE_METRICS = state.STATE_METRICS.filter(item => item.field.fieldId !== payload)
        },
        DELETE_FILTER: (state, payload) => {
            state.STATE_FILTERS = state.STATE_FILTERS.filter(item => item.metricId !== payload)
        },
        DELETE_COLUMN_SORT: (state) => {
            state.STATE_COLUMN_SORT = []
        }
    }
})