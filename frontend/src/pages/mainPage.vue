<template>
  <meta-data/>
  <col-measure/>
  <row-measure/>
<<<<<<< Updated upstream
=======
  <metrics-list/>
>>>>>>> Stashed changes
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
      <!-- Сам доволен, что до такого лаконичного решения допер.
       Но мне кажется, что с этим костылем будет много багов...
       -->
      <template v-if=" (returnCubeRequest().rowFields.length > returnCubeRequest().columnFields.length) && returnCubeRequest().columnFields.length">
        <th v-for="n in returnCubeRequest().rowFields.length - returnCubeRequest().columnFields.length"></th>
      </template>

      <template v-for="headerCubeRequest in returnCubeRequest().columnFields">
        <th>{{ table_data.data.fields.find(item => item.id === headerCubeRequest.fieldId).name }}</th>
        <template v-for="columnValue in OPAL_data.data.columnValues">
          <th>{{ columnValue[0] }}</th>
        </template>
      </template>
    </tr>
    <tr>
      <template v-for="headerCubeRequest in returnCubeRequest().rowFields">
        <th>{{ table_data.data.fields.find(item => item.id === headerCubeRequest.fieldId).name }}</th>
      </template>
      <template v-for="headerCubeRequest in returnCubeRequest().metrics">
        <template v-for="columnValue in OPAL_data.data.columnValues">
          <th>{{ table_data.data.fields.find(item => item.id === headerCubeRequest.field.fieldId).name }}
            {{ headerCubeRequest.aggregationType }}
          </th>
        </template>
      </template>
    </tr>
    <template v-for="(rowValue, index) in OPAL_data.data.rowValues">
      <tr>
        <template v-for="n in rowValue.length">
          <th>{{ rowValue[n - 1] }}</th>
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

export default {
  components: {
    ColMeasure,
    RowMeasure,
    colMetrics, rowMetrics, metaData, dialogWindow, metricsList
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
      rowsInPage: 20,
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
        console.log(response.data);
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
        "jobId": 85,
        "columnFields": this.$store.getters.COl_MEASURE,
        "rowFields": this.$store.getters.ROW_MEASURE,
        "metrics": this.$store.getters.METRICS,
        "columnsInterval": {
          "from": 0,
          "count": 300
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
