<script setup lang="ts">
import { inject, ref, computed } from 'vue'
import axios from 'axios'
import Problem from '../Problem.vue'
import { api } from '../../utils/api'
import { kBookData } from '../../utils/data'
import { getChineseCid, getId } from '../../utils/idProc'

const pass = ref('')
const msg = ref('')
const state = ref<'error' | 'pending' | 'none'>('none')

const bookData = inject(kBookData)!

type Problem = {
    cid: number
    pid: string
}
type Report = {
    problems: Problem[],
    time: string
}
type Frequency = {
    count: number
    id: string
    cid: number
    pid: string
}[]
const reports = ref<Report[]>()
const frequency = ref<Frequency>()

const fetchReports = async () => {
    try {
        const { data } = await axios.post(api('/analyze'), {
            pass: pass.value
        })
        reports.value = data.reports
        const freq: Record<string, Frequency[number]> = {}
        reports.value!
            .flatMap(x => x.problems)
            .forEach(({ cid, pid }) => {
                console.log(cid, pid)
                const id = getId(cid, pid)
                freq[id] ??= { count: 0, id, cid, pid }
                freq[id].count ++
            })
        frequency.value = Object.values(freq).sort((a, b) => b.count - a.count)
        state.value = data.state
        msg.value = data.msg
    }
    catch (err) {
        state.value = 'error'
        msg.value = '网络错误'
    }
}
</script>

<template>
    <div>
        <h2>错题记录</h2>
        密码 <input v-model="pass" type="password" />
        <br />
        <button @click="fetchReports">获取错题</button>
        <span :class="[ 'msg', state ]">{{ msg }}</span>
        <div class="reports" v-if="reports">
            <h2>所有错题</h2>
            共 {{ frequency?.length }} 道
            <div v-for="{ count, cid, pid, id } of frequency">
                <span class="report-count">{{ count }} 次</span>
                <Problem :id="id" :problem="bookData[cid][pid]"></Problem>
            </div>

            <h2>所有提交</h2>
            共 {{ reports.length }} 次
            <div class="report" v-for="{ time, problems } of reports">
                在 <span class="report-time">{{ new Date(time).toUTCString() }}</span>，有 {{ problems.length }} 道
                <div v-for="{ cid, pid } of problems">
                    <Problem :id="getChineseCid(cid + 1) + '/' + pid" :problem="bookData[cid][pid]"></Problem>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.reports {
    text-align: left;
    width: 80vw;
}

.report {
    margin-bottom: 2em;
}

.report-time {
    color: #888;
}

.report-count {
    color: #eb1e77;
    margin-right: .2em;
}
</style>