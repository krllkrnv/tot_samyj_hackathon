<template>
  <meta-data/>
  <col-measure/>
  <row-measure/>
  <v-select
      v-model="rowsInPage"
      :items="[10, 20, 50, 100, 200]"
      class="select-rows-count"
      hide-details="true"
      label="Строк на странице"
      variant="underlined"/>
  <h3>Страница:
    <input
        v-model="currentPageNumber"
        :max="pageCount"
        class="table-toolbar__input"
        min="1"
        type="number"
        @change="getCube((currentPageNumber - 1) * rowsInPage, rowsInPage)"/>
    из {{ pageCount }}
  </h3>
  <div class="table-toolbar">
    <v-btn class="table-toolbar__btn" @click="firstPage">
      <v-icon
          icon="mdi-arrow-collapse-left"
      />
    </v-btn>
    <v-btn class="table-toolbar__btn" @click="prevPage">
      <v-icon
          icon="mdi-menu-left-outline"
      />
    </v-btn>
    <v-btn class="table-toolbar__btn" @click="nextPage">
      <v-icon
          icon="mdi-menu-right-outline"
      />
    </v-btn>
    <v-btn class="table-toolbar__btn" @click="lastPage">
      <v-icon
          icon="mdi-arrow-collapse-right"
      />
    </v-btn>
  </div>
  <v-table v-if="table_data && OPAL_data">
    <thead>
    <tr>
      <!-- Тут шиза. Вкратце - у нас есть наша table_data - метаданные короче.
       У нас есть returnCubeRequest, прикол в том, что в table_data мы получаем таблицу, и у каждой там ячейки есть id.
       А в returnCubeRequest мы подаем в теле запроса id, и для того, чтобы мы отрисовали тот поле из метаданных,
       id которого совпадает с id в посылаемом запросе, я сделал двойной прогон с v-for. Совпадают id - отрисовываем.
       -->
      <template v-for="headerTableData in table_data.data.fields" :key="headerTableData.ordinal">
        <template v-for="headerCubeRequest in returnCubeRequest().rowFields">
          <template v-if="headerTableData.id === headerCubeRequest.fieldId">
            <th class="text-left" @click="console.log(headerTableData.id)">
              {{ headerTableData.name }}
            </th>
          </template>
        </template>
        <template>
        </template>
      </template>
      <template v-if="OPAL_data" class="metrics-template">
        <template v-for="headMetric in OPAL_data.data.metricValues">
          <th>{{ table_data.data.fields.find(item => item.id === headMetric.fieldId).name }} -
            {{ headMetric.aggregationType }}
          </th>
        </template>
      </template>
    </tr>

    </thead>
    <!--
     На самом деле я тут методом тыка сделал, чтобы метрика выводилась. Сказать нечего.
     Есть задел на улучшение кода - видишь, тут [0] - можно избавиться от этого, просто еще один прогон
     по v-for сделать, и тогда оно будет само индексироваться, но сейчас мне не хочется переделывать..
     -->
    <tbody v-if="OPAL_data">
    <tr v-for="(rowElement, index) in OPAL_data.data.rowValues">
      <td v-for="colElement in rowElement">{{ colElement }}</td>
      <template v-if="OPAL_data.data.metricValues">
        <td v-for="el in OPAL_data.data.metricValues">{{ el.values[0][index] }}</td>
      </template>
    </tr>

    </tbody>
  </v-table>
</template>

<script>
import axios from 'axios'
import colMetrics from "../components/colMeasure.vue";
import rowMetrics from "../components/rowMeasure.vue";
import metaData from "../components/metaData.vue";
import RowMeasure from "../components/rowMeasure.vue";
import ColMeasure from "../components/colMeasure.vue";
import dialogWindow from "../components/dialogWindow.vue";

export default {
  components: {
    ColMeasure,
    RowMeasure,
    colMetrics, rowMetrics, metaData, dialogWindow
  },
  created() {
    this.getMetadata();
  },
  mounted() {
    this.getCube((this.currentPageNumber - 1) * this.rowsInPage, this.rowsInPage);
  },
  data() {
    return {
      table_data: null,
      OPAL_data: null,
      rowsInPage: 100,
      currentPageNumber: 1,
      from: 0, // вынес в data для удобства (не помню уже какого удобства, короче потом можно в пропсы кинуть)
      count: 0,
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
        console.log(this.table_data)
        this.$store.commit('SET_META_DATA', this.table_data.data.fields)
      } catch {

      }
    },
    async getCube(from, count) {
      try { // returnCubeRequest - возвращает запрос с from, count
        const response = await axios.post('/api/v1/olap/get-cube', this.returnCubeRequest(from, count), {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        //console.log(response.data);
        this.OPAL_data = response.data;
      } catch {

      }
    },
    prevPage() {
      if (this.currentPageNumber > 1) {
        this.currentPageNumber--;
        this.from = (this.currentPageNumber - 1) * this.rowsInPage;
        this.count = this.rowsInPage
        this.getCube();
      }
    },
    nextPage() {
      if (this.currentPageNumber < this.pageCount) {
        this.currentPageNumber++;
        this.from = (this.currentPageNumber - 1) * this.rowsInPage;
        this.count = this.rowsInPage
        this.getCube();
      }
    },
    firstPage() {
      if (this.currentPageNumber !== 1) {
        this.currentPageNumber = 1;
        this.from = 0;
        this.count = this.rowsInPage
        this.getCube();
      }
    },
    lastPage() {
      if (this.currentPageNumber !== this.pageCount) {
        this.currentPageNumber = this.pageCount;
        this.from = (this.currentPageNumber - 1) * this.rowsInPage
        this.count = this.rowsInPage
        this.getCube();
      }
    },
    // Передаем из data значения в качестве параметров по умолчанию
    returnCubeRequest(from = this.from, count = this.count) {
      return {
        "columnFields": [],
        "rowFields": this.$store.getters.ROW_MEASURE,
        "metrics": [
        ],
        "columnsInterval": {
          "from": 0,
          "count": 24
        },
        "rowsInterval": {
          "from": from,
          "count": count
        },
        "filterGroup": {
          "childGroups": [],
          "filters": [],
          "invertResult": false,
          "operationType": "AND"
        },
        "metricFilterGroup": {
          "childGroups": [],
          "filters": [],
          "invertResult": false,
          "operationType": "AND"
        }
      }
    }
  },
  computed: {
    pageCount() {
      if (this.table_data) {
        return Math.ceil(this.table_data.data.totalRows / this.rowsInPage);
      }
    }
  },
  watch: {
    rowsInPage() {
      this.getCube((this.currentPageNumber - 1) * this.rowsInPage, this.rowsInPage)
    },
    '$store.getters.ROW_MEASURE': {
      handler() {
        this.getCube((this.currentPageNumber - 1) * this.rowsInPage, this.rowsInPage);
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

.table-toolbar{
  height: 50px;
  width: 300px;
  margin: 20px 0px;
}

.table-toolbar__btn{
  margin: 5px;
  height: 40px;
  width: 40px;
}

.table-toolbar__input{
  width: 60px;
}

.select-rows-count{
  width: 100px;
}

.table-toolbar {
  height: 50px;
  width: 300px;
  margin: 20px 0px;
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
  width: 100px;
}
</style>
