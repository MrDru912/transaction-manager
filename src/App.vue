<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useDisplay } from 'vuetify';
import sound from '../src/assets/music_theme.mp3'
import clickSoundFile from '../src/assets/click3.wav'

const { smAndDown } = useDisplay();

const rail = ref(false);
const drawerWidth = computed(() => {return !smAndDown.value ? 220 : 100})
const turnOnMusic = ref(false);

const adjustNavigationdrawer = () => {
  if (window.innerWidth < 1000) {
    rail.value = true;
  } else {
    rail.value = false;
  }
  console.log(window.innerWidth + " " + rail.value);
}

window.addEventListener('resize', () => {
  adjustNavigationdrawer();
})

onMounted(() => {
  adjustNavigationdrawer();
})

const musicTheme = new Audio(sound);
const clickSound = new Audio(clickSoundFile);

const toggleMusic = () => {
  if (!turnOnMusic.value) {
    musicTheme.play();
    turnOnMusic.value = true;
  } else {
    musicTheme.pause();
    turnOnMusic.value = false;
  }
}

const playClickSound = () => {
  clickSound.play();
}

</script>

<template>
  <v-app>
    <!-- <nav> -->
      <!-- <RouterLink to="/Transactions">Transactions</RouterLink>
      <RouterLink to="/Statistics">Statistics</RouterLink> -->
    <!-- </nav> -->
    <main>
      <RouterView />
    </main>


    <v-navigation-drawer :width="drawerWidth" permanent>
      <v-list-item align="center" title="">Finance manager</v-list-item>
      <v-divider></v-divider>
      <v-list-item v-if="!rail" link align="center" title="Transaction list" @click="playClickSound();this.$router.push('/Transactions')">
        <template v-slot:append>
          <v-icon size="large">mdi-table-large</v-icon>
        </template>
      </v-list-item>
      <v-list-item v-else link align="center" @click="playClickSound();this.$router.push('/Transactions')">
        <template v-slot:default>
          <v-icon size="large">mdi-table-large</v-icon>
        </template>
      </v-list-item>


      <v-list-item v-if="!rail" link align="center" title="Statistics" @click="playClickSound();this.$router.push('/Statistics')">
        <template v-slot:append>
          <v-icon size="large">mdi-chart-arc</v-icon>
        </template>
      </v-list-item>
      <v-list-item v-else link align="center" @click="playClickSound();this.$router.push('/Statistics')">
        <template v-slot:default>
          <v-icon size="large">mdi-chart-arc</v-icon>
        </template>
      </v-list-item>

      <v-list-item v-if="!rail" link align="center" title="Budget and goals" @click="playClickSound();this.$router.push('/BudgetAndGoals')">
        <template v-slot:append>
          <v-icon size="large">mdi-currency-usd</v-icon>
        </template>
      </v-list-item>
      <v-list-item v-else align="center" link @click="playClickSound();this.$router.push('/BudgetAndGoals')">
        <template v-slot:default>
          <v-icon size="large">mdi-currency-usd</v-icon>
        </template>
      </v-list-item>
      
      <v-list-item v-if="!rail" link align="center">
        <v-switch color="primary" label="Turn on music" v-model="turnOnMusic" @click="playClickSound();toggleMusic()"></v-switch>
      </v-list-item>
      <v-list-item v-else align="center" link>
        <v-switch color="primary" v-model="turnOnMusic" @click="playClickSound();toggleMusic()"></v-switch>
      </v-list-item>

    </v-navigation-drawer>
  </v-app>
</template>

<style scoped>

main {
  position: relative;
  left: 220px;
  width: calc(100% - 220px);
  height: 100vh;
}

@media screen and (max-width: 1000px) {
main {
  left: 100px;
  width: calc(100% - 100px);
}
}

</style>
