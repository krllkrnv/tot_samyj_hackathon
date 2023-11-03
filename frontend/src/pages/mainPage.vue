<template>
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
  created(){
    this.getMetadata();
	},
	mounted(){
		this.getCube((this.currentPageNumber - 1) * this.rowsInPage, this.rowsInPage);
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
</style>