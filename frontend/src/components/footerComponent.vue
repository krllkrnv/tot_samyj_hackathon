<template>
  <v-footer
      absolute inset app height="64" width="auto"      class="text-center d-flex flex-column"
      color="#FA5FA2"
  >
    <div class="pt-0">
      MicroPyrziky
    </div>

    <v-divider></v-divider>

    <div>
      {{ new Date().getFullYear() }}
    </div>
  </v-footer>
</template>

<script>
export default {

}
</script>

<style scoped>

</style>