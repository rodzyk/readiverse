import { BinaryFormatReader } from "../common";

export class ExthHeader extends BinaryFormatReader {
    identifier: string;
    headerLength: number;
    recordCount: number;
    rawRecords: any[];
    records: any;
    constructor(view: DataView, startOffset: number) {
        super(view);

        this.offset = startOffset
        this.init();
    }

    init() {
        this.identifier = this.readString(4)
        this.headerLength = this.readUint32()
        this.recordCount = this.readUint32()

        this.rawRecords = [];
        for (var i = 0; i < this.recordCount; i++) {
            var recordType = this.readUint32();
            var recordLength = this.readUint32();
            var recordData = this.getBuffer(this.offset, recordLength - 8)
            this.rawRecords.push({ type: recordType, data: recordData });
            this.skip(recordLength - 8)
        }

        this.records = this.readRecords();
    }

    readRecords() {

        const readRecords = []

        for (var i = 0; i < this.rawRecords.length; i++) {
            const record = this.rawRecords[i];
            const type = record.type;
            const td = new TextDecoder();

            let data = record.data

            if ([201, 204, 205, 206, 207, 131, 116, 300, 203, 202].includes(type)) {
                data = new DataView(record.data).getUint32(0);
            } else {
                data = td.decode(record.data);
            }

            readRecords.push({ type, data })
        }

        const map = readRecords.reduce((acc, { type, data }) => {
            if (acc.has(type)) {
                const existingData = acc.get(type);

                if (Array.isArray(existingData)) {
                    existingData.push(data);
                } else {
                    acc.set(type, [existingData, data]);
                }
            } else {
                acc.set(type, data);
            }
            return acc;
        }, new Map());

        return map;

    }
}