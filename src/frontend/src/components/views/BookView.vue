<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import axios from 'axios'
import Problem from '../Problem.vue'
import { kBookData } from '../../utils/data'
import { api } from '../../utils/api'
import { getChineseCid } from '../../utils/idProc'

const data = inject(kBookData)!

const fcid = ref<number>()
const fpid1 = ref<string>()
const fpid2 = ref<number>()

const filterChapter = (cid: number) => (! fcid.value || fcid.value === cid + 1)
const filterProblem = (pid: string) => (
    ! fcid.value || ! fpid1.value ||
    (fpid1.value && ! fpid2.value && pid.startsWith(fpid1.value)) ||
    (fpid1.value && fpid2.value && pid === `${fpid1.value}/${fpid2.value}`)
)

const pidsAvailable = computed(() => {
    if (! fcid.value) return []
    return [...new Set(Object.keys(data[fcid.value - 1]).map(x => x[0]))]
})

watch(fcid, () => {
    if (fpid1.value && ! pidsAvailable.value.includes(fpid1.value))
        fpid1.value = undefined
})

const selected = ref([] as { cid: number, pid: string }[])
const addProblem = (cid: number, pid: string) => {
    if (! selected.value.some(x => x.cid === cid && x.pid === pid))
        selected.value.push({ cid, pid })
}
const removeProblem = (cid: number, pid: string) => {
    const i = selected.value.findIndex(x => x.cid === cid && x.pid === pid)
    selected.value.splice(i, 1)
}

const pass = ref('')
const msg = ref('')
const state = ref<'error' | 'pending' | 'none'>('none')

const report = async () => {
    if (! pass.value) {
        state.value = 'error'
        msg.value = '需要输入密码'
        return
    }
    if (! selected.value.length) {
        state.value = 'error'
        msg.value = '需选择题目'
        return
    }
    try {
        state.value = 'pending'
        msg.value = '请求中...'
        const { data } = await axios.post(api('/report'), {
            pass: pass.value,
            problems: selected.value
        })
        selected.value = []
        state.value = data.state
        msg.value = data.msg
    }
    catch (err) {
        state.value = 'error'
        msg.value = '网络错误'
        console.error(err)
    }
}

const bookContainer = ref<HTMLDivElement | undefined>()
</script>

<template>
    <div>
        <div class="toolbar">
            第 <input type="number" min="1" :max="data.length" v-model="fcid" /> 课
            <template v-if="fcid">
                / 第 <select v-model="fpid1"><option v-for="id1 of pidsAvailable">{{ id1 }}</option></select> 大题 
            </template>
            <template v-if="fcid && fpid1">
                / 第 <input type="number" min="1" v-model="fpid2" /> 小题
            </template>
            <br />
            <button @click="report">记录错题</button>
            密码 <input v-model="pass" type="password" />
            <span :class="[ 'msg', state ]">{{ msg }}</span>
        </div>
        <div class="book" ref="bookContainer">
            <div class="select-info">
                <h2 @click="bookContainer?.scrollTo(0, 0)">已选择 </h2>
                共 {{ selected.length }} 道
                <button @click="selected = []">清除</button>
            </div>

            <div class="chapter">
                <div v-for="{ cid, pid } of selected">
                    <button class="mini" @click="removeProblem(cid, pid)">&times;</button>
                    <Problem :id="getChineseCid(cid + 1) + '/' + pid" :problem="data[cid][pid]"></Problem>
                </div>
            </div>
            <template v-for="chapter, cid of data">
                <div class="chapter" v-if="! fcid || (cid + 1 === fcid)">
                    <h2>第 {{ cid + 1 }} 课</h2>

                    <template v-for="problem, pid in chapter" :key="pid">
                        <div v-if="filterProblem(pid)">
                            <button class="mini" @click="addProblem(cid, pid)">+</button>
                            <Problem :id="pid" :problem="problem"></Problem>
                        </div>
                    </template>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
.toolbar {
    text-align: left;
    line-height: 2em;
}

.book {
    height: 70vh;
    width: 80vw;
    overflow-y: auto;
    line-height: 2em;
}

.chapter {
    text-align: left;
}

.select-info {
    position: sticky;
    top: 0;
    background: #242424;
    text-align: left;
}

.select-info > h2:hover {
    text-decoration: underline;
    cursor: pointer;
}

@media (prefers-color-scheme: light) {
    .select-info {
        background-color: #fff;
    }
}
</style>