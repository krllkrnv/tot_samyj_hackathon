<template>
  <div class="app">
    <v-app>
      <header-component><main-page/></header-component>
      <footer-component/>
    </v-app>
  </div>
</template>

<script>
import mainPage from "./pages/mainPage.vue";
import FooterComponent from "./components/footerComponent.vue";
import headerComponent from "./components/headerComponent.vue";
export default {
  name: 'App',
  components: {headerComponent, FooterComponent, mainPage},

}
</script>

<style scoped>

</style>