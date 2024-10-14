export class Uint8ArrayCombiner {
    private buffers: Array<Uint8Array>

    constructor(buffers: Array<Uint8Array>) {
        this.buffers = buffers;
    }

    combine(): Uint8Array {
        const reducer = (acc: number, array: any) => acc + array.length
        const totalLength: number = this.buffers.reduce(reducer, 0);
        const combinedArray: Uint8Array = new Uint8Array(totalLength);

        let offset: number = 0;

        this.buffers.forEach(array => {
            combinedArray.set(array, offset);
            offset += array.length;
        });

        return combinedArray;
    }
}
