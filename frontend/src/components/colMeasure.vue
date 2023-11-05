<template>
  <v-card variant="outlined">Измерения по столбцам
    <v-card v-for="elem in colData"
            class="v-card-element ma-5" width="100%" variant="tonal"
            max-width="500"
    >
      <v-card-title>{{metaData.find(item => item.id === elem.fieldId).name}}</v-card-title>
      <v-card-actions>
        <v-btn @click="this.$store.commit('DELETE_COL_MEASURE', elem.fieldId)" color="error" variant="tonal">Удалить</v-btn>
      </v-card-actions>
    </v-card>
  </v-card>
</template>

<script>
import {mapGetters} from "vuex";

export default {
computed: {
  ...mapGetters(['COl_MEASURE', 'META_DATA']),
  colData(){
    return this.COl_MEASURE
  },
  metaData(){
    return this.META_DATA
  }
},
}
</script>

<style scoped>

</style>