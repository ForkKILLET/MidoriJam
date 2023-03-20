import fs from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const buf = await fs.readFile(resolve(fileURLToPath(import.meta.url), '../../output/midori.md'))
const text = buf
    .toString()
    .replace(/[\uFF10-\uFF19\uFF0E]/g, x => (
        String.fromCharCode(x.charCodeAt(0) - 0xfee0)
    ))

const chapters = text.split(/(?=#)/g)

const chapterData = chapters
    .map(ch => ch
        .replace(/(?<!\s)A\./g, '\nA.')
        .split(/\r?\n/g)
        .filter(x => (
            ! x.match(/· \d+·/)
        ))
        .map(x => x.replace(/^>\s*/g, ''))
    )
    .map(ch => {
        const dict = {}
        let id1, id, res
        const splitChoice = () => {
            if (dict[id]?.choice) {
                dict[id].choice = dict[id].choice
                    .split(/\s*(?=[BCD])/g)
                    .map(x => x.trim().split('.'))
            }
        }
        for (const ln of ch) {
            if (ln.match(/^[一二三四五]/)) {
                id1 = ln[0]
                continue
            }
            res = ln.match(/(\d+)\.\s*(.+)/)
            if (res) {
                splitChoice()
                const [, id2, cont] = res
                id = id1 + '/' + id2
                dict[id] = { cont }
                continue
            }
            res = ln.match(/[ABCD]\./g)
            if (res) {
                dict[id].choice ??= ''
                dict[id].choice += ln + '\n'
            }
        }
        splitChoice()
        return dict
    })

for (const [chid, ch] of chapterData.entries()) {
    console.log('\n##########\n' + (chid + 1) + '\n##########\n')
    for (let id in ch) {
        console.log(id + ':\t %o\n', ch[id])
    }
}

const chapterJSON = JSON.stringify(chapterData)
await fs.writeFile(resolve(fileURLToPath(import.meta.url), '../../output/midori.json'), chapterJSON)