<template>
  <v-card variant="outlined">Фильтры
    <v-card v-for="elem in filters_list"
            class="v-card-element ma-5" width="100%" variant="tonal"

    >
      <v-card-title> {{metaData.find(item => item.id === metrics[elem.metricId].field.fieldId).name}} <br> {{elem.filterType}}: {{elem.values[0]}}</v-card-title>
      <v-card-actions>
        <v-btn @click="this.$store.commit('DELETE_FILTER', elem.metricId)" color="error" variant="tonal">Удалить</v-btn></v-card-actions>
    </v-card>
  </v-card>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  computed: {
    ...mapGetters(['META_DATA', 'FILTERS_LIST', 'METRICS']),
    filters_list(){
      return this.FILTERS_LIST
    },
    metaData(){
      return this.META_DATA
    },
    metrics(){
      return this.METRICS
    }
  }
}
</script>

<style scoped>

</style>