<template>
  Метаданные:
  <v-dialog
      v-model="dialog"
      width="auto"
  ><dialog-window
  :meta-element="pickedElement"
  /></v-dialog>
  <div class="pa-5 ">
    <template v-for="(elem, index) in metaData">
      <v-card variant="text" class="mb-1" >


            <v-card max-width="500" @click="pickedElement = elem; dialog = !dialog" class="v-card-element" width="100%" variant="tonal">
              {{elem}}
            </v-card>


      </v-card>
    </template>
  </div>
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
}
</style>