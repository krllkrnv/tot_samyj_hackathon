<template>
  <meta-data/>
  <col-measure/>
  <row-measure/>
  <metrics-list/>
  <filters-list/>
  <div v-if="this.$store.getters.COl_MEASURE.length || this.$store.getters.ROW_MEASURE.length || this.$store.getters.METRICS.length">
    <v-select
        v-model="rowsInPage"
        :items="[10, 20, 50, 100, 200]"
        class="select-rows-count"
        hide-details="true"
        label="Строк на странице"
        variant="underlined"/>
    <v-select
        v-model="columnsInPage"
        :items="[1, 2, 5, 10, 20]"
        class="select-rows-count"
        hide-details="true"
        label="Столбцов на странице"
        variant="underlined"/>
    <h3>Страница:
      <input
          v-model="currentPageNumber"
          :max="pageCount"
          class="table-toolbar__input"
          min="1"
          type="number"
          @change="getCube((this.currentPageNumber - 1) * this.rowsInPage, this.rowsInPage, (this.currentPageColNumber - 1) * this.columnsInPage, this.columnsInPage)"/>
      из {{ pageCount }}
    </h3>
    <div class="table-toolbar">
      <v-btn class="table-toolbar__btn" @click="prevColPage">
        <v-icon
            icon="mdi-menu-left-outline"
        />
      </v-btn>
      <v-btn class="table-toolbar__btn" @click="prevPage">
        <v-icon
            icon="mdi-menu-up-outline"
        />
      </v-btn>
      <v-btn class="table-toolbar__btn" @click="nextPage">
        <v-icon
            icon="mdi-menu-down-outline"
        />
      </v-btn>
      <v-btn class="table-toolbar__btn" @click="nextColPage">
        <v-icon
            icon="mdi-menu-right-outline"
        />
      </v-btn>
      <v-btn @click="transposeTable()">Транспонировать таблицу</v-btn>
      <v-card v-if="stateColumnSort[0]">
        <v-card-title class="text-h5">Сортировка</v-card-title>
        <v-card-title>Метрика:
          {{ table_data.data.fields[table_data.data.fields.findIndex(item => item.id === stateMetrics[stateColumnSort[0].metricId].field.fieldId)].name }}
          <br>
          Порядок сортировки: {{ stateColumnSort[0].order }}
          <br>
          Значение измерения: {{ stateColumnSort[0].tuple[0] }}
        </v-card-title>

        <v-btn class="table-toolbar__btn" width="100" @click="this.$store.commit('DELETE_COLUMN_SORT')">Удалить</v-btn>

      </v-card>
    </div>
    <v-table v-if="table_data && OPAL_data">
      <thead>
      <tr>
        <!-- Сам доволен, что до такого лаконичного решения допер.
         Но мне кажется, что с этим костылем будет много багов...
         -->
        <template
            v-if=" (returnCubeRequest().rowFields.length > returnCubeRequest().columnFields.length) && returnCubeRequest().columnFields.length">
          <th v-for="n in returnCubeRequest().rowFields.length - returnCubeRequest().columnFields.length"></th>
        </template>

        <template v-for="headerCubeRequest in returnCubeRequest().columnFields">
          <th style="background-color: #f38297; color: white;">
            {{ table_data.data.fields.find(item => item.id === headerCubeRequest.fieldId).name }}
          </th>
          <template v-for="columnValue in OPAL_data.data.columnValues" class="table-header">
            <th :colspan="returnCubeRequest().metrics.length" style="background-color: #f38297; color: white;">
              {{ columnValue[0] }}
            </th>
          </template>
        </template>
      </tr>
      <tr>
        <template v-for="headerCubeRequest in returnCubeRequest().rowFields">
          <th style="background-color: #f38297; color: white;">
            {{ table_data.data.fields.find(item => item.id === headerCubeRequest.fieldId).name }}
          </th>
        </template>
        <template v-for="columnValue in OPAL_data.data.columnValues">
          <template v-for="headerCubeRequest in returnCubeRequest().metrics">
            <th
                style="background-color: #f38297; color: white;">
              {{ table_data.data.fields.find(item => item.id === headerCubeRequest.field.fieldId).name }}
              {{ headerCubeRequest.aggregationType }}
              <div class="cell-btn">
                <v-btn
                    class="ma-1"
                    icon="mdi: mdi-arrow-down" @click="addSort(stateMetrics.findIndex(item => item.field.fieldId === headerCubeRequest.field.fieldId), columnValue[0], 'Descending')"></v-btn>
                <v-btn
                    class="ma-1"
                    icon="mdi: mdi-arrow-up" @click="addSort(stateMetrics.findIndex(item => item.field.fieldId === headerCubeRequest.field.fieldId), columnValue[0], 'Ascending')"></v-btn>
              </div>
            </th>
          </template>
        </template>
      </tr>
      <template v-for="(rowValue, index) in OPAL_data.data.rowValues">
        <tr>
          <template v-for="n in rowValue.length">
            <th style="background-color: #f38297; color: white;">{{ rowValue[n - 1] }}</th>
          </template>

          <template v-if="OPAL_data.data.metricValues">
            <template v-for="n in OPAL_data.data.metricValues.length">
              <template v-for="elem in OPAL_data.data.metricValues[n-1].values">
                <th>{{ elem[index] }}</th>
              </template>
            </template>
          </template>
        </tr>
      </template>
      </thead>
    </v-table>
  </div>
  <div v-else>
    <v-card-title class="text-center">
      <br>
      Таблица пуста. Укажите измерения по столбцам или по строкам.
    </v-card-title>
  </div>
</template>

<script>
import axios from 'axios'
import colMetrics from "../components/colMeasure.vue";
import ColMeasure from "../components/colMeasure.vue";
import rowMetrics from "../components/rowMeasure.vue";
import RowMeasure from "../components/rowMeasure.vue";
import metaData from "../components/metaData.vue";
import dialogWindow from "../components/dialogWindow.vue";
import metricsList from "../components/metricsList.vue";
import filtersList from "../components/filtersList.vue";

export default {
  components: {
    ColMeasure,
    RowMeasure,
    colMetrics, rowMetrics, metaData, dialogWindow, metricsList, filtersList
  },
  created() {
    this.getMetadata();
  },
  mounted() {
    this.getCube((this.currentPageNumber - 1) * this.rowsInPage, this.rowsInPage, (this.currentPageColNumber - 1) * this.columnsInPage, this.columnsInPage);
  },
  data() {
    return {
      table_data: null,
      OPAL_data: null,
      rowsInPage: 20,
      columnsInPage: 5,
      currentPageNumber: 1,
      currentPageColNumber: 1,
      from_rows: 0, // вынес в data для удобства (не помню уже какого удобства, короче потом можно в пропсы кинуть)
      count_rows: 20,
      from_columns: 0,
      count_columns: 5,
    }
  },
  methods: {
    async getMetadata() {
      try {
        const response = await axios.post('/api/v1/report-job/get-metadata', {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        this.table_data = response.data;
        this.$store.commit('SET_META_DATA', this.table_data.data.fields)
      } catch {

      }
    },
    async getCube(from_rows, count_rows, from_columns, count_columns) {
      try { // returnCubeRequest - возвращает запрос с from, count
        const response = await axios.post('/api/v1/olap/get-cube', this.returnCubeRequest(from_rows, count_rows, from_columns, count_columns), {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        this.OPAL_data = response.data;
      } catch {

      }
    },
    prevColPage() {
      if (this.currentPageColNumber > 1) {
        this.currentPageColNumber--;
        this.from_columns = (this.currentPageColNumber - 1) * this.columnsInPage;
        this.count_columns = this.columnsInPage;
        this.getCube();
      }
    },
    prevPage() {
      if (this.currentPageNumber > 1) {
        this.currentPageNumber--;
        this.from_rows = (this.currentPageNumber - 1) * this.rowsInPage;
        this.count_rows = this.rowsInPage
        this.getCube();
      }
    },
    nextPage() {
      if (this.currentPageNumber < this.pageCount) {
        this.currentPageNumber++;
        this.from_rows = (this.currentPageNumber - 1) * this.rowsInPage;
        this.count_rows = this.rowsInPage
        this.getCube();
      }
    },
    nextColPage() {
      if (this.currentPageColNumber < Math.ceil(this.OPAL_data.data.totalColumns / this.columnsInPage)) {
        this.currentPageColNumber++;
        this.from_columns = (this.currentPageColNumber - 1) * this.columnsInPage;
        this.count_columns = this.columnsInPage
        this.getCube();
      }
    },
    // Передаем из data значения в качестве параметров по умолчанию
    returnCubeRequest(from_rows = this.from_rows, count_rows = this.count_rows, from_columns = this.from_columns, count_columns = this.count_columns) {
      return {
        "jobId": 85,
        "columnFields": this.$store.getters.COl_MEASURE,
        "rowFields": this.$store.getters.ROW_MEASURE,
        "metrics": this.$store.getters.METRICS,
        "columnsInterval": {
          "from": from_columns,
          "count": count_columns
        },
        "rowsInterval": {
          "from": from_rows,
          "count": count_rows
        },
        "columnSort": this.$store.getters.COLUMN_SORT,
        "filterGroup": {
          "childGroups": [],
          "filters": [],
          "invertResult": false,
          "operationType": "AND"
        },
        "metricFilterGroup": {
          "childGroups": [],
          "filters": this.$store.getters.FILTERS_LIST,
          "invertResult": false,
          "operationType": "AND"
        }
      }
    },
    transposeTable() {
      let bufferVariable = this.$store.getters.COl_MEASURE
      this.$store.commit('SET_COL_MEASURES', this.$store.getters.ROW_MEASURE)
      this.$store.commit('SET_ROW_MEASURES', bufferVariable)
    },
    addSort(metricId, tuple, order) {
      this.$store.commit('SET_COLUMN_SORT', {
        metricId: metricId,
        order: order,
        tuple: [
          tuple
        ]
      })
      console.log(this.$store.getters.COLUMN_SORT)
    },
  },
  computed: {
    pageCount() {
      if (this.OPAL_data) {
        return Math.ceil(this.OPAL_data.data.totalRows / this.rowsInPage);
      }
    },
    stateMetrics() {
      return this.$store.getters.METRICS
    },
    stateColumnSort() {
      return this.$store.getters.COLUMN_SORT
    }
  },
  watch: {
    rowsInPage() {
      this.currentPageNumber = 1;
      this.getCube((this.currentPageNumber - 1) * this.rowsInPage, this.rowsInPage, (this.currentPageColNumber - 1) * this.rowsInPage, this.columnsInPage);
    },
    columnsInPage() {
      this.currentPageColNumber = 1;
      this.getCube((this.currentPageNumber - 1) * this.rowsInPage, this.rowsInPage, (this.currentPageColNumber - 1) * this.rowsInPage, this.columnsInPage);
    },
    '$store.getters.ROW_MEASURE': {
      handler() {
        this.getCube((this.currentPageNumber - 1) * this.rowsInPage, this.rowsInPage, (this.currentPageColNumber - 1) * this.rowsInPage, this.columnsInPage);
      },
      deep: true
    },
    '$store.getters.COL_MEASURE': {
      handler() {
        this.getCube((this.currentPageNumber - 1) * this.rowsInPage, this.rowsInPage, (this.currentPageColNumber - 1) * this.rowsInPage, this.columnsInPage);
      },
      deep: true
    },
    '$store.getters.METRICS': {
      handler() {
        this.getCube((this.currentPageNumber - 1) * this.rowsInPage, this.rowsInPage, (this.currentPageColNumber - 1) * this.rowsInPage, this.columnsInPage);
      },
      deep: true
    },
    '$store.getters.FILTER_LIST': {
      handler() {
        this.getCube((this.currentPageNumber - 1) * this.rowsInPage, this.rowsInPage, (this.currentPageColNumber - 1) * this.rowsInPage, this.columnsInPage);
      },
      deep: true
    },
    '$store.getters.COLUMN_SORT': {
      handler() {
        this.getCube((this.currentPageNumber - 1) * this.rowsInPage, this.rowsInPage, (this.currentPageColNumber - 1) * this.rowsInPage, this.columnsInPage);
      },
      deep: true
    }
  },

}
</script>

<style scoped>
.v-table th:hover {
  background-color: #f0f0f0; /* Измените цвет фона на желаемый */
  cursor: pointer; /* Измените курсор мыши на указатель, чтобы указать на интерактивность */

}

.cell-btn {
  display: flex;
  flex-direction: row;
}

.table-toolbar__btn {
  margin: 5px;
  height: 40px;
  width: 40px;
}

.table-toolbar__input {
  width: 60px;
}

.select-rows-count {
  margin: 10px;
  display: inline-block;
  width: 150px;
}

.v-table {
  border: 1px solid #ccc;
  border-collapse: collapse;
  margin: 0;
  padding: 0;
  table-layout: fixed;
}

th, td {
  border: 1px solid rgba(121, 77, 77, 0.81);
}

</style>
