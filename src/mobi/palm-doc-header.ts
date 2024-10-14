import { BinaryFormatReader } from "../common";

export class PalmDocHeader extends BinaryFormatReader {
    compression: number
    unused: number
    textLength: number
    recordCount: number
    recordSize: number
    encryptionType?: number
    unknown?: number
    currentPosition?: number

    constructor(view: DataView, startOffset: number) {
        super(view);

        this.offset = startOffset
        this.init();
    }

    init() {
        this.compression = this.readUint16();
        this.unused = this.readUint16();
        this.textLength = this.readUint32();
        this.recordCount = this.readUint16();
        this.recordSize = this.readUint16();
        if (this.compression == 17480) {
            this.encryptionType = this.readUint16();
            this.unknown = this.readUint16();
        } else {
            this.currentPosition = this.readUint32();
        }
    }
}