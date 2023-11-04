<template>
<<<<<<< Updated upstream
	<col-metrics />
	<v-spacer></v-spacer>
	<row-metrics />
	<v-spacer></v-spacer>
	<v-select
		label="Строк на странице"
		v-model="rowsInPage"
		:items="[10, 20, 50, 100, 200]"
		variant="underlined"
		hide-details="true"
		class="select-rows-count"/>
	<h3>Страница:
		<input 
			type="number" 
			min="1"
			:max="pageCount"
			v-model="currentPageNumber" 
			@change="getCube((currentPageNumber - 1) * rowsInPage, rowsInPage)" 
			class="table-toolbar__input" /> 
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
=======
  <col-metrics/>
  <row-metrics/>
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
>>>>>>> Stashed changes
</template>

<script>
import axios from 'axios'
import colMetrics from "../components/colMetrics.vue";
import rowMetrics from "../components/rowMetrics.vue";

export default {
<<<<<<< Updated upstream
	components: {
		colMetrics, rowMetrics
	},
	created(){
		this.getMetadata();
	},
	mounted(){
		this.getCube((this.currentPageNumber - 1) * this.rowsInPage, this.rowsInPage);
	},
	data () {
		return {
			table_data: null,
			OPAL_data: null,
			rowsInPage: 100,
			currentPageNumber: 1
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
				this.table_data = response.data;
				console.log(this.table_data);
			} catch {

			}
		},
		async getCube(from, count) {
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
					"from": from,
					"count": count
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
				console.log(response.data);
				this.OPAL_data = response.data;
			} catch {

			}
		},
		prevPage(){
			if (this.currentPageNumber > 1){
				this.currentPageNumber--;
				this.getCube((this.currentPageNumber - 1) * this.rowsInPage, this.rowsInPage);
			}
		},
		nextPage(){
			if (this.currentPageNumber < this.pageCount){
				this.currentPageNumber++;
				this.getCube((this.currentPageNumber - 1) * this.rowsInPage, this.rowsInPage);
			}
		},
		firstPage(){
			if (this.currentPageNumber !== 1){
				this.currentPageNumber = 1;
				this.getCube(0, this.rowsInPage);
			}
		},
		lastPage(){
			if (this.currentPageNumber !== this.pageCount){
				this.currentPageNumber = this.pageCount;
				this.getCube((this.currentPageNumber - 1) * this.rowsInPage, this.rowsInPage);
			}
		}
	},
	computed: {
		pageCount(){
			if (this.table_data){
				return Math.ceil(this.table_data.data.totalRows / this.rowsInPage);
			}
		}
	},
	watch: {
		rowsInPage(){
			this.getCube((this.currentPageNumber - 1) * this.rowsInPage, this.rowsInPage)
		}
	},

=======
  components: {
    colMetrics, rowMetrics
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
        //console.log(this.table_data);
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
        "columnFields": [],
        "rowFields": [
          {
            "fieldId": 15,
            "fieldType": "REPORT_FIELD"
          }
        ],
        "metrics": [
          {
            "field": {
              "fieldId": 19,
              "fieldType": "REPORT_FIELD"
            },
            "aggregationType": "SUM"
          }
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
    }
  },

>>>>>>> Stashed changes
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