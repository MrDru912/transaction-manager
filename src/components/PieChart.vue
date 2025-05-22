<template>
  <div class="pie-chart-container">
    <div class="pie-chart" :style="pieStyle"></div>
    <div class="legend">
      <div
        v-for="(cat, i) in categories"
        :key="cat"
        class="legend-item"
      >
        <span class="legend-color" :style="{ backgroundColor: colors[i % colors.length] }"></span>
        <span class="legend-label">{{ cat }}</span>
        <span class="legend-percent">{{ percentages[i].toFixed(1) }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTransactionsStore } from '../stores/transactionStore'

const store = useTransactionsStore()

// Compute category totals
const categorySums = computed(() => {
  const sums: Record<string, number> = {}
  for (const t of store.transactions) {
    sums[t.category] = (sums[t.category] || 0) + t.amount
  }
  return sums
})

const total = computed(() =>
  Object.values(categorySums.value).reduce((a, b) => a + b, 0)
)

const categories = computed(() => Object.keys(categorySums.value))

const percentages = computed(() =>
  categories.value.map(cat =>
    (categorySums.value[cat] / total.value) * 100
  )
)

const colors = [
  '#f94144', '#f3722c', '#f8961e', '#f9844a',
  '#43aa8b', '#577590', '#90be6d', '#277da1',
]

const pieStyle = computed(() => {
  if (total.value === 0) return { background: '#eee' }

  let angle = 0
  const segments: string[] = []

  categories.value.forEach((cat, i) => {
    const val = categorySums.value[cat]
    const start = angle
    const end = angle + (val / total.value) * 360
    segments.push(`${colors[i % colors.length]} ${start}deg ${end}deg`)
    angle = end
  })

  return {
    background: `conic-gradient(${segments.join(', ')})`
  }
})
</script>

<style scoped>
.pie-chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px auto;
}

.pie-chart {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  border: 4px solid #ccc;
  margin-bottom: 16px;
}

/* Small screens: phones (max width 600px) */
@media (max-width: 600px) {
  .pie-chart {
    width: 160px;
    height: 160px;
  }
}

/* Medium screens: tablets (601px to 960px) */
@media (min-width: 601px) and (max-width: 960px) {
  .pie-chart {
    width: 250px;
    height: 250px;
  }
}

/* Large screens: desktops (961px and up) */
@media (min-width: 961px) {
  .pie-chart {
    width: 320px;
    height: 320px;
  }
}


.legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 220px;
  font-size: 14px;
}

.legend-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.legend-color {
  width: 14px;
  height: 14px;
  border-radius: 2px;
  margin-right: 8px;
  flex-shrink: 0;
}

.legend-label {
  flex-grow: 1;
  margin-left: 4px;
  text-transform: capitalize;
}

.legend-percent {
  color: #666;
  font-weight: bold;
}
</style>
