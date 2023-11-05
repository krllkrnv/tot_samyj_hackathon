<template>
  <v-card variant="text">
    <v-card-title>Измерения по строкам    <v-icon icon="mdi mdi-land-rows-horizontal"></v-icon></v-card-title>
    <v-row class="pa-5">
      <v-card v-for="(elem, index) in rowData"
              class="v-card-element ma-2 pa-2 rounded-lg" elevation="1" variant="tonal"
      >
          <v-card-title>{{metaData.find(item => item.id === elem.fieldId).name}}</v-card-title>
          <v-card-actions>
            <v-btn @click="this.$store.commit('DELETE_ROW_MEASURE', elem.fieldId)" color="error" variant="tonal">Удалить</v-btn>
          </v-card-actions>
        </v-card>
    </v-row>
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