import data from '../../../datagen/output/midori.json'

export default data as unknown as Array<
    Record<
        string, {
            cont: string
            choice?: [string, string][]
        }
    >
>