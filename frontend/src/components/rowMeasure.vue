<template>
  <div>Измерения по строкам
    {{ rowData }}  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
computed: {
  ...mapGetters(['ROW_MEASURE']),
  rowData(){
    return this.ROW_MEASURE
  }
}
}
</script>

<style scoped>

</style>