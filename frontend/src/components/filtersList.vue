<template>
  <v-card variant="text">
    <v-card-title>
      Фильтры    <v-icon icon="mdi mdi-filter"></v-icon>
    </v-card-title>
      <v-row class="pa-5">
        <v-card v-for="(elem, index) in filters_list"
                class="v-card-element ma-2 pa-2 rounded-lg" elevation="1" variant="tonal"
        >
            <v-card-title> {{metaData.find(item => item.id === metrics[elem.metricId].field.fieldId).name}} <br> {{elem.filterType}}: {{elem.values[0]}}</v-card-title>
            <v-card-actions>
              <v-btn @click="this.$store.commit('DELETE_FILTER', elem.metricId)" color="error" variant="tonal">Удалить</v-btn></v-card-actions>
        </v-card>
      </v-row>
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
.v-card-element{
  transition: transform 0.3s ease-in-out;
}
.v-card-element:hover{
  transform: scale(1.05)
}
</style>