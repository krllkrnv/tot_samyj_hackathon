<template>
  <v-card v-if="metaElement">
    <v-card-title>
      {{metaElement.name}}
    </v-card-title>
    <v-card-subtitle>
      {{metaElement.description}}
    </v-card-subtitle>
    <v-card-actions>
      <v-select
          label="Выберите опцию"
          :items="selectOptions"
          v-model="selectedOption"
      ></v-select>
    </v-card-actions>
    <v-card-actions v-if="selectedOption === 'Метрика'">
      <v-select
          label="Выберите опцию"
          :items="metricOption"
          v-model="selectedMetricOption"></v-select>
    </v-card-actions>
    <v-btn @click="addElement">Подтвердить</v-btn>
  </v-card>
</template>

<script>
export default {
  props: {
    metaElement: {
      type: Object,
    }
  },
  data(){
    return{
      selectOptions: ['Измерение по столбцам', 'Измерение по строкам', 'Метрика'],
      metricOption: ['COUNT', 'COUNT_DISTINCT', 'SUM', 'MAX', 'MIN', 'AVG'],
      selectedOption: null,
      selectedMetricOption: null
    }
  },
  methods: {
    addElement(){
      if (this.selectedOption === 'Измерение по строкам') {
        this.$store.commit('ADD_ROW_MEASURE',
            {
              fieldId: this.metaElement.id,
              fieldType: 'REPORT_FIELD'
            })
      }
      if (this.selectedOption === 'Измерение по столбцам') {
        this.$store.commit('ADD_COL_MEASURE',
            {
              fieldId: this.metaElement.id,
              fieldType: 'REPORT_FIELD'
            })
      }
      if (this.selectedOption === 'Метрика') {
        this.$store.commit('ADD_METRIC',
            {
              "field": {
                "fieldId": this.metaElement.id,
                "fieldType": "REPORT_FIELD"
              },
              "aggregationType": this.selectedMetricOption
            })
      }
      this.$emit('close');
    }
  }
}
</script>

<style scoped>

</style>