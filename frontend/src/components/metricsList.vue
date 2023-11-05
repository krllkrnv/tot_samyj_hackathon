<template>
  <v-card variant="text">
    <v-card-title>Метрики    <v-icon icon="mdi mdi-table-large"></v-icon></v-card-title>
    <v-row class="pa-5">
      <v-card v-for="(elem, index) in metrics"
              class="v-card-element ma-2 pa-2 rounded-lg" elevation="1" variant="tonal"
      >
          <v-card-title>{{metaData.find(item => item.id === elem.field.fieldId).name}} {{elem.aggregationType}}</v-card-title>
          <v-card-actions>
            <v-dialog
                v-model="showDialog">
              <v-card width="500" class="align-self-center">
                <v-card-title class="text-center">Добавление фильтра</v-card-title>
                <v-select
                    label="Выберите фильтр"
                    :items="filterOption"
                    v-model="selectedOption">
                </v-select>
                <v-text-field
                    v-if="selectedOption"
                    v-model="filterValue"
                    hide-details
                    label="Введите значение"
                    type="number"
                />
                <v-btn
                    @click="this.$store.commit('ADD_FILTER', {
              filterType: selectedOption,
              invertResult: false,
              metricId: metrics.findIndex(item => item.field.fieldId === pickedElement.field.fieldId),
              rounding: 0,
              values: [filterValue]
            }); this.showDialog = !this.showDialog"
                    v-if="selectedOption">
                  Подтвердить
                </v-btn>
              </v-card>
            </v-dialog>
            <v-btn @click="this.$store.commit('DELETE_METRIC', elem.field.fieldId)" color="error" variant="tonal">Удалить</v-btn>
            <v-btn
                @click="showDialog = !showDialog; pickedElement = elem; console.log(pickedElement)"

            >Добавить фильтр</v-btn>
          </v-card-actions>
        </v-card>
    </v-row>
  </v-card>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  data(){
    return{
      selectedOption: null,
      filterOption: ['EQUALS', 'GREATER', 'LESSER', 'GREATER_OR_EQUALS', 'LESSER_OR_EQUALS'],
    showDialog: false,
      pickedElement: null,
      filterValue: null
  }
  },
computed: {
  ...mapGetters(['METRICS', 'META_DATA']),
  metrics(){
    return this.METRICS
  },
  metaData(){
    return this.META_DATA
  }
},
  methods: {
    addFilter(){

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
