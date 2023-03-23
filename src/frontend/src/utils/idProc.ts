const chinese = '一二三四五六七八九'

export const getChineseCid = (cid: number): string => {
    let res = ''
    const d1 = cid % 10
    if (d1) res = chinese[d1 - 1]
    const d2 = cid / 10 | 0
    if (d2) {
        if (d2 === 1) res = '十' + res
        else res = chinese[d2 - 1] + '十' + res
    }
    return res
}

export const getId = (cid: number, pid: string): string => (
    getChineseCid(cid + 1) + '/' + pid
)
