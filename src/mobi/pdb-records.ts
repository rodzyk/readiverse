import { BinaryFormatReader } from "../common";

export type PdbRecord = { dataOffset: number, attributes: number, uniqueID: string }

export class PdbRecords extends BinaryFormatReader {
    list: PdbRecord[];
    offset: number;
    constructor(view: DataView, startOffset: number) {
        super(view);

        this.offset = startOffset
    }

    parse(recordsNumber: number): PdbRecord[] {
        this.list = [];
        for (let i = 0; i < recordsNumber; i++) {
            const record: any = {}
            record.dataOffset = this.readUint32();
            record.attributes = this.readUint8();
            record.uniqueID = this.readString(3);
            this.list.push(record);
        }
        return this.list;
    }

    static getRecordExtrasize(data, flags) {
        let pos = data.length - 1;
        let extra = 0;

        const MULTIBYTE_OVERLAP = 0x0001;
        const MAX_TRAILING_BITS = 15;

        for (let i = MAX_TRAILING_BITS; i > 0; i--) {
            if (flags & (1 << i)) {
                let [size, length, newPos] = PdbRecords.bufferGetVarlen(data, pos);
                pos = newPos - (size - length);
                extra += size;
            }
        }

        if (flags & MULTIBYTE_OVERLAP) {
            let a = data[pos];
            extra += (a & 0x3) + 1;
        }

        return extra;
    }

    static bufferGetVarlen(data, pos) {
        let size = 0;
        let byteCount = 0;
        let shift = 0;

        while (byteCount < 4) {
            let byte = data[pos--];
            size |= (byte & 0x7F) << shift;
            shift += 7;
            byteCount++;

            if (byte & 0x80) {
                break;
            }
        }

        return [size, byteCount, pos];
    }
}