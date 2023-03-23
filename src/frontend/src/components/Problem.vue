<script setup lang="ts">
import type { Problem } from '../utils/data'

defineProps<{
    problem: Problem
    id: string
}>()
</script>

<template>
    <span class="pid">{{ id }}</span> {{ problem.cont }}
    <div class="choices" v-if="problem.choice">
        <span class="choice" v-for="[sid, choice] of problem.choice">
            <span class="choice-id">{{ sid }}.</span> {{ choice }}
        </span>
    </div>
</template>

<style scoped>
.pid {
    color: #646cff;
}

.choices {
    display: flex;
    justify-content: space-between;
}

.choice {
    display: inline-block;
    width: 25%;
    margin-right: 1em;
}

.choice:nth-child(2n) {
    background-color: #eee;
}

.choice-id {
    color: #888;
}
</style>