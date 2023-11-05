<template>
  <v-card variant="text">
    <v-card-title>Метаданные</v-card-title>
    <v-dialog v-model="dialog" width="auto">
      <dialog-window :meta-element="pickedElement" />
    </v-dialog>
    <v-row class="pa-2">
      <v-col v-for="(elem, index) in metaData" :key="index" cols="2" sm="6" md="4" lg="3">
          <v-card  @click="pickedElement = elem; dialog = !dialog" class="v-card-element ma-2 pa-2 rounded-lg" elevation="1"  variant="tonal">
            <v-card-title>{{ elem.name }}</v-card-title>
          </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import dialogWindow from "./dialogWindow.vue";

export default {
  computed: {
    ...mapGetters(['META_DATA']),
    metaData() {
      return this.META_DATA;
    }
  },
  components: {
    dialogWindow
  },
  data(){
    return{
      pickedElement: null,
      dialog: false,
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
}.main-table {
   overflow-x: auto;
 }

.main-table table {
  width: 100%;
  border-collapse: collapse;
}

.main-table th, .main-table td {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

.main-table th {
  background-color: #f2f2f2;
}

@media (max-width: 600px) {
  .main-table table {
    width: 100%;
  }

  .main-table th, .main-table td {
    white-space: nowrap;
  }
}
</style>