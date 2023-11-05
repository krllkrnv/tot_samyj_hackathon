<template>
  <v-card variant="outlined">Измерения по строкам
    <v-card v-for="elem in rowData"
            class="v-card-element ma-5" width="100%" variant="tonal"
            max-width="500"
    >
      <v-card-title>{{metaData.find(item => item.id === elem.fieldId).name}}</v-card-title>
      <v-card-actions>
        <v-btn @click="this.$store.commit('DELETE_ROW_MEASURE', elem.fieldId)" color="error" variant="tonal">Удалить</v-btn>
      </v-card-actions>
    </v-card>
  </v-card>
</template>

<script>
import {mapGetters} from "vuex";

export default {
computed: {
  ...mapGetters(['ROW_MEASURE', 'META_DATA']),
  rowData(){
    return this.ROW_MEASURE
  },
  metaData(){
    return this.META_DATA
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