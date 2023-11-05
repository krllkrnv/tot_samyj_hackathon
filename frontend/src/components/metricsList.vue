<template>
  <v-card variant="outlined">Метрики
    <v-card v-for="elem in metrics"
            class="v-card-element ma-5" width="100%" variant="tonal"

    >
      <v-card-title>{{metaData.find(item => item.id === elem.field.fieldId).name}} {{elem.aggregationType}}</v-card-title>
      <v-card-actions>
        <v-btn @click="this.$store.commit('DELETE_METRIC', elem.field.fieldId)" color="error" variant="tonal">Удалить</v-btn>      </v-card-actions>
    </v-card>
  </v-card>
</template>

<script>
import {mapGetters} from "vuex";

export default {
computed: {
  ...mapGetters(['METRICS', 'META_DATA']),
  metrics(){
    return this.METRICS
  },
  metaData(){
    return this.META_DATA
  }
}
}
</script>

<style scoped>

</style>