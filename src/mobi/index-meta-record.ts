import { BinaryFormatReader } from "../common";

export class IndexMetaRecord extends BinaryFormatReader {
    identifier: string;
    headerLength: number;
    indexType: number;
    unknown1: number;
    unknown2: number;
    idxtStart: number;
    indexCount: number;
    indexEncoding: number;
    indexLanguage: number;
    totalIndexCount: number;
    ordtStart: number;
    ligtStart: number;
    unknown3: number;
    unknown4: number;
    constructor(view: DataView, startOffset: number) {
        super(view);

        this.offset = startOffset
        this.init();
    }

    init() {
        this.skip(2)

        const startOffset = this.tell();
        this.identifier = this.readString(4)
        this.headerLength = this.readUint32()
        this.indexType = this.readUint32() // 0 - normal index, 2 - inflections

        this.unknown1 = this.readUint32()
        this.unknown2 = this.readUint32()

        this.idxtStart = this.readUint32()
        this.indexCount = this.readUint32()
        this.indexEncoding = this.readUint32()
        this.indexLanguage = this.readUint32()
        this.totalIndexCount = this.readUint32()
        this.ordtStart = this.readUint32()
        this.ligtStart = this.readUint32()

        this.unknown3 = this.readUint32()
        this.unknown4 = this.readUint32()

        this.seek(startOffset + this.headerLength)
    }
}