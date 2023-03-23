import { InjectionKey } from 'vue'
import data from '../../../datagen/output/midori.json'

export type Problem = {
    cont: string
    choice?: [string, string][]
}

export type Book = Array<
    Record<string, Problem>
>

export const kBookData = Symbol() as InjectionKey<Book>

export default data as unknown as Book
