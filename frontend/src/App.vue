<template>
  <div class="app">
    <v-app>
    	<v-app-bar elevation="0"
                   color="#FA5FA2"
                   prominent>
			<div class="d-flex align-center">
				<v-icon size="50" class="mr-3">mdi-poll</v-icon>
				<div class="text-h4">Сводная таблица анализа данных</div>
			</div>
		</v-app-bar>
		<v-main>
			<main-page/>
		</v-main>
		<v-footer :app="!(this.$store.getters.COl_MEASURE.length || this.$store.getters.ROW_MEASURE.length)" height="64" color="#FA5FA2">
		    <v-row justify="center" no-gutters>
		      <v-col class="text-center mt-4" cols="12">
		        2023 — <strong>MicroPyrziky</strong>
		      </v-col>
		    </v-row>
		  </v-footer>
    </v-app>
  </div>
</template>

<script>
import mainPage from "./pages/mainPage.vue";
export default {
  name: 'App',
  components: {mainPage},

}
</script>

<style scoped>

</style>