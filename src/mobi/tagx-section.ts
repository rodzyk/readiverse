import { BinaryFormatReader } from "../common";

export class TagxSection extends BinaryFormatReader {
    identifier: string;
    headerLength: number;
    controlByteCount: number;
    tagTable: any[];

    constructor(view: DataView, startOffset: number) {
        super(view);

        this.offset = startOffset
        this.init();
    }

    init() {
        this.identifier = this.readString(4)
        this.headerLength = this.readUint32()
        this.controlByteCount = this.readUint32()
        const tagTableLength = this.headerLength - 12;
        const tagTableEntries = tagTableLength / 4;

        this.tagTable = [];

        for (let i = 0; i < tagTableEntries; i++) {
            let tagEntry = {
                tagID: this.readUint8(),
                valuesNumber: this.readUint8(),
                bitMusk: this.readUint8(),
                endControlByte: this.readUint8()
            };
            this.tagTable.push(tagEntry);
        }
    }
}