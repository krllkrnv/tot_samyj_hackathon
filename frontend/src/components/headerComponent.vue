<template>
  <div>
    <v-card variant="text">
      <v-layout>
        <v-app-bar elevation="0"
                   color="#FA5FA2"
                   prominent
        >          <v-spacer></v-spacer>

          <v-toolbar-title>Сводная таблицы анализа данных</v-toolbar-title>

          <v-spacer></v-spacer>


        </v-app-bar>



        <v-main>
          <v-app><slot></slot></v-app>
        </v-main>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
</style>