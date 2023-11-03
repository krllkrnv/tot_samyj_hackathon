<template>
  <col-metrics
  
  />
  <v-spacer></v-spacer>
  <row-metrics/>
  <v-spacer></v-spacer>
  <v-btn @click="getCube()">Заполнить всю таблицу данными с сервера</v-btn>
  <v-table v-if="table_data">
    <thead>
    <tr>
      <template v-for="header in table_data.data.fields" :key="header.ordinal">
      <th @click="console.log(header.id)" class="text-left">
        {{header.name}}
      </th>
      </template>
    </tr>
    </thead>
    <tbody v-if="OPAL_data">
      <tr v-for="rowElement in this.OPAL_data.data.rowValues">
        <td v-for="colElement in rowElement">{{ colElement }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
import axios from 'axios'
import colMetrics from "../components/colMetrics.vue";
import rowMetrics from "../components/rowMetrics.vue";

export default {
  data () {
    return {
      table_data: null,
      OPAL_data: null,
    }
  },
  methods:{
    async getMetadata(){
      try {
        const response = await axios.post('/api/v1/report-job/get-metadata', {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        this.table_data = response.data
        console.log(this.table_data)
      } catch {

      }
    },
    async getCube() {
      const data = {
        "columnFields": [],
        "rowFields": [
          {
            "fieldId": 14,
            "fieldType": "REPORT_FIELD"
          },
          {
            "fieldId": 15,
            "fieldType": "REPORT_FIELD"
          },
          {
            "fieldId": 16,
            "fieldType": "REPORT_FIELD"
          },
          {
            "fieldId": 17,
            "fieldType": "REPORT_FIELD"
          },
          {
            "fieldId": 18,
            "fieldType": "REPORT_FIELD"
          },
          {
            "fieldId": 19,
            "fieldType": "REPORT_FIELD"
          },
          {
            "fieldId": 20,
            "fieldType": "REPORT_FIELD"
          },
          {
            "fieldId": 21,
            "fieldType": "REPORT_FIELD"
          },
          {
            "fieldId": 22,
            "fieldType": "REPORT_FIELD"
          },
          {
            "fieldId": 23,
            "fieldType": "REPORT_FIELD"
          },
          {
            "fieldId": 24,
            "fieldType": "REPORT_FIELD"
          },
          {
            "fieldId": 25,
            "fieldType": "REPORT_FIELD"
          },
          {
            "fieldId": 26,
            "fieldType": "REPORT_FIELD"
          }
        ],
        "metrics": [],
        "metricPlacement": "ROWS",
        "filterGroup": {
          "operationType": "AND",
          "invertResult": false,
          "childGroups": [],
          "filters": [],
          "allFields": []
        },
        "metricFilterGroup": {
          "operationType": "AND",
          "invertResult": false,
          "childGroups": [],
          "filters": [],
          "allMetricIds": []
        },
        "columnsInterval": {
          "from": 0,
          "count": 100
        },
        "rowsInterval": {
          "from": 0,
          "count": 100
        },
        "columnSort": [],
        "rowSort": [],
        "allFields": []
      }
      try{
        const response = await axios.post('/api/v1/olap/get-cube', data, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        console.log(response.data)
        this.OPAL_data = response.data
      } catch {

      }
    }
  },
  created() {
    this.getMetadata()
},
  components: {
    colMetrics, rowMetrics
  }
}
</script>

<style scoped>
.v-table th:hover {
  background-color: #f0f0f0; /* Измените цвет фона на желаемый */
  cursor: pointer; /* Измените курсор мыши на указатель, чтобы указать на интерактивность */
}
</style>