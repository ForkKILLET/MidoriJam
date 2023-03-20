<script setup lang="ts">
import { computed, ref, watch } from 'vue'
const data = (await import('../../utils/data')).default

const fcid = ref<number>()
const fpid1 = ref<string>()
const fpid2 = ref<number>()

const isFiltered = (pid: string) => (
    ! fcid.value || ! fpid1.value ||
    (fpid1.value && ! fpid2.value && pid.startsWith(fpid1.value)) ||
    (fpid1.value && fpid2.value && pid === `${fpid1.value}/${fpid2.value}`)
)

watch(fcid, () => {
    if (fpid1.value && ! allfpid1.value.includes(fpid1.value)) fpid1.value = undefined
})

const allfpid1 = computed(() => {
    if (! fcid.value) return []
    return [...new Set(Object.keys(data[fcid.value - 1]).map(x => x[0]))]
})
</script>

<template>
    <div class="filter">
        第 <input type="number" min="1" :max="data.length" v-model="fcid" /> 课
        <template v-if="fcid">
            / 第 <select v-model="fpid1"><option v-for="id1 of allfpid1">{{ id1 }}</option></select> 大题 
        </template>
        <template v-if="fcid && fpid1">
            / 第 <input type="number" min="1" v-model="fpid2" /> 小题
        </template>
    </div>
    <div class="book">
        <template v-for="chapter, cid of data">
            <div class="chapter" v-if="! fcid || (cid + 1 === fcid)">
                <h2>第 {{ cid + 1 }} 课</h2>

                <template v-for="problem, pid in chapter">
                    <div v-if="isFiltered(pid)">
                        <span class="pid">{{ pid }}</span> {{ problem.cont }}
                        <div class="choices" v-if="problem.choice">
                            <span class="choice" v-for="[sid, choice] of problem.choice">
                                <span class="choice-id">{{ sid }}.</span> {{ choice }}
                            </span>
                        </div>
                    </div>
                </template>
            </div>
        </template>
    </div>
</template>

<style scoped>
.filter {
    text-align: left;
}

.book {
    height: 80vh;
    width: 80vw;
    overflow-y: auto;
}

.chapter {
    text-align: left;
}

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

input, select {
    background: #eee;
    outline: none;
    border: none;
    border-bottom: #000 2px solid;
    transition: .3s border-color;
}

input:focus, select:focus {
    border-color: #646cff;
}
</style>