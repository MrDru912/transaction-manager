<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useDisplay } from 'vuetify';
import sound from '../src/assets/music-theme.mp3'
import sound2 from '../src/assets/music-theme-2.mp3'
import sound3 from '../src/assets/music-theme-3.mp3'
import clickSoundFile from '../src/assets/click4.wav'
import Transactions from './views/TransactionsView.vue'
import Statistics from './views/StatisticsView.vue'
import BudgetAndGoals from './views/BudgetAndGoalsView.vue'

const { smAndDown } = useDisplay();

const rail = ref(false);
const drawerWidth = computed(() => {return !smAndDown.value ? 220 : 100})
const turnOnMusic = ref(false);

const currentView = ref('Transactions') // default view

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

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}


const musicTheme = new Audio(sound);
const musicTheme2 = new Audio(sound2);
const musicTheme3 = new Audio(sound3);
const clickSound = new Audio(clickSoundFile);

let currentTheme = musicTheme;

const toggleMusic = () => {
  if (!turnOnMusic.value) {
    const randomNum = getRandomInt(1, 4);
    console.log(randomNum);

    // Pause current theme and reset its time
    currentTheme.pause();
    currentTheme.currentTime = 0;

    // Switch to a new theme
    switch (randomNum) {
      case 1:
        currentTheme = musicTheme;
        break;
      case 2:
        currentTheme = musicTheme2;
        break;
      case 3:
        currentTheme = musicTheme3;
        break;
    }

    // Start new theme from beginning
    currentTheme.currentTime = 0;
    currentTheme.play();
    turnOnMusic.value = true;

  } else {
    currentTheme.pause();
    turnOnMusic.value = false;
  }
}

const playClickSound = () => {
  clickSound.play();
}

const showOffline = ref(!navigator.onLine)
const showOnline = ref(navigator.onLine)

window.addEventListener('online', () => {
  showOffline.value = false
  showOnline.value = true
})

window.addEventListener('offline', () => {
  showOffline.value = true
  showOnline.value = false
})

function openTransactionsView () {
  playClickSound();
  currentView.value = 'Transactions';
  history.pushState({ view: currentView.value }, '', window.location.href);
}

function openStatisticsView () {
  playClickSound();
  currentView.value = 'Statistics';
  history.pushState({ view: currentView.value }, '', window.location.href);
}

window.addEventListener('popstate', (event) => {
    if (event.state && event.state.view) {
        currentView.value = event.state.view;
    }
});

</script>

<template>
  <v-app>
    <main>
      <Transactions v-if="currentView === 'Transactions'" />
      <Statistics v-if="currentView === 'Statistics'" />
      <BudgetAndGoals v-if="currentView === 'BudgetAndGoals'" />
    </main>

    <nav>
      <v-navigation-drawer :width="drawerWidth" permanent>
        <v-list-item align="center" class="nav-header">Finance manager</v-list-item>
        <v-divider></v-divider>
        <v-list>
                <!-- Transactions -->
        <v-list-item
          v-if="!rail"
          link
          align="center"
          title="Transaction list"
          @click="openTransactionsView"
          :active="currentView === 'Transactions'"
        >
          <template v-slot:append>
            <v-icon size="large">mdi-table-large</v-icon>
          </template>
        </v-list-item>
        <v-list-item
          v-else
          link
          align="center"
          @click="openTransactionsView"
          :active="currentView === 'Transactions'"
        >
          <template v-slot:default>
            <v-icon size="large">mdi-table-large</v-icon>
          </template>
        </v-list-item>
  
        <!-- Statistics -->
        <v-list-item
          v-if="!rail"
          link
          align="center"
          title="Statistics"
          @click="openStatisticsView"
          :active="currentView === 'Statistics'"
        >
          <template v-slot:append>
            <v-icon size="large">mdi-chart-arc</v-icon>
          </template>
        </v-list-item>
        <v-list-item
          v-else
          link
          align="center"
          @click="openStatisticsView"
          :active="currentView === 'Statistics'"
        >
          <template v-slot:default>
            <v-icon size="large">mdi-chart-arc</v-icon>
          </template>
        </v-list-item>
  
        <!-- Budget and Goals
        <v-list-item
          v-if="!rail"
          link
          align="center"
          title="Budget and goals"
          @click="playClickSound(); currentView = 'BudgetAndGoals'"
          :active="currentView === 'BudgetAndGoals'"
        >
          <template v-slot:append>
            <v-icon size="large">mdi-currency-usd</v-icon>
          </template>
        </v-list-item>
        <v-list-item
          v-else
          align="center"
          link
          @click="playClickSound(); currentView = 'BudgetAndGoals'"
          :active="currentView === 'BudgetAndGoals'"
        >
          <template v-slot:default>
            <v-icon size="large">mdi-currency-usd</v-icon>
          </template>
        </v-list-item> -->
  
        <!-- Music toggle -->
        <v-list-item v-if="!rail" link align="center">
          <v-switch color="primary" label="Turn on music" v-model="turnOnMusic" @click="playClickSound(); toggleMusic()" />
        </v-list-item>
        <v-list-item v-else align="center" link>
          <v-switch color="primary" v-model="turnOnMusic" @click="playClickSound(); toggleMusic()" />
        </v-list-item>
  
        </v-list>
        <v-snackbar v-model="showOnline" color="primary" timeout="2000" location="top">
          ✅ You're online.
        </v-snackbar>
        <v-snackbar v-model="showOffline" color="error" timeout="2000" location="top">
          ⚠️ You're offline. Some features may not work.
        </v-snackbar>
      </v-navigation-drawer>
    </nav>
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

.nav-header {
  text-stroke: 1px rgba(0, 0, 0, 0.51);
  -webkit-text-stroke: 1px rgba(0, 0, 0, 0.51);
}
</style>
