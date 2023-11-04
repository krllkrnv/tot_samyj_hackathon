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
    selectOptions: ['Измерение по строкам', 'Измерение по столбцам', 'Метрика по строкам', 'Метрика по столбцам'],
    selectedOption: null
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
  }
  }
}
</script>

<style scoped>

</style>