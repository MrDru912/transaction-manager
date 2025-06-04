<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTransactionsStore } from '../stores/transactionStore'

const store = useTransactionsStore()

// Compute category totals
const categorySums = computed(() => {
  const sums: Record<string, number> = {}
  for (const t of store.transactions.filter(t => t.currency === store.statsCurrencyFilter)) {
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
  '#f94144', '#f3722c', '#FFC300', '#8e44ad',
  '#43aa8b', '#577590', '#90be6d', '#277da1',
  '#DAF7A6', '#f8961e', '#FF5733', '#900C3F',
  '#ffe933', '#76d7c4', '#ca6f1e', '#b2babb', '#f5b7b1', '#a9cce3',
  '#f5b7b1', 
//   '', '', '',
//   '', '', '', '',
//   '', '', '', '',
//   '', '', '', '',
]

const data = computed(() => {
    return categories.value.map(value => {
        console.log(value + " " + categorySums.value[value] + " ");
        return categorySums.value[value]
  })
})


const hover = ref(false)

const slices = computed(() => {
  let start = 0
  return data.value.map(value => {
    const angle = (value / total.value) * 360
    const slice = { startAngle: start, endAngle: start + angle }
    start += angle
    return slice
  })
  .filter(categorySum => categorySum);
})

// Arc path helper
function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = (angle - 90) * Math.PI / 180
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad)
  }
}

function describeArc(x: number, y: number, r: number, startAngle: number, endAngle: number) {
  if (endAngle - startAngle >= 360) {
    return `
      M ${x} ${y - r}
      A ${r} ${r} 0 1 1 ${x} ${y + r}
      A ${r} ${r} 0 1 1 ${x} ${y - r}
    `
  }

  const start = polarToCartesian(x, y, r, endAngle)
  const end = polarToCartesian(x, y, r, startAngle)
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0

  return [
    `M ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    `L ${x} ${y}`,
    'Z'
  ].join(' ')
}

</script>

<template>
  <div class="pie-chart-container">
<svg
  viewBox="0 0 200 200"
  width="250"
  height="250"
  class="pie-chart-svg"
  @mouseenter="hover = true"
  @mouseleave="hover = false"
  :style="{
    transform: hover ? 'scale(1.05)' : 'scale(1)',
    transition: 'transform 0.3s ease-in-out',
    display: 'inline-block'
  }"
>
  <g transform="translate(100,100)">
    <template v-for="(d, i) in slices" :key="d.startAngle + '-' + d.endAngle + '-' + i">
      <path
        :d="describeArc(0, 0, 90, d.startAngle, d.endAngle)"
        :fill="colors[i % colors.length]"
        class="pie-slice"
        :style="{ transform: 'scale(1)', transition: 'transform 0.3s', animationDelay: `${i * 0.1}s` }"
      />
    </template>
  </g>
</svg>
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

<style scoped>
.pie-chart-svg {
  transform: perspective(600px) rotateX(10deg) rotateY(15deg);
  transition: transform 1s;
}
.pie-slice {
  opacity: 0;
  transform: scale(0.5);
  animation: fadeGrow 0.6s ease-out forwards;
}

@keyframes fadeGrow {
  to {
    opacity: 1;
    transform: scale(1);
  }
}


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
  animation: timer 4s infinite linear;
}

@property --percentage {
  initial-value: 0%;
  inherits: false;
  syntax: "<percentage>";
}

.chart {
  background: conic-gradient(red var(--percentage), white 0);
  border-radius: 50%;
  width: 40vmin;
  height: 40vmin;
  animation: timer 4s infinite linear;
}

@keyframes timer {
  to {
    --percentage: 100%;
  }
}


@media (max-width: 600px) {
  .pie-chart {
    width: 160px;
    height: 160px;
  }
}

@media (min-width: 601px) and (max-width: 960px) {
  .pie-chart {
    width: 250px;
    height: 250px;
  }
}

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
