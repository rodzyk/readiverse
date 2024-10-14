import { BinaryFormatReader } from "../common";

export class PdbHeader extends BinaryFormatReader {
    name: string;
    attributes: number;
    version: number;
    creationDate: number;
    modificationDate: number;
    lastBackupDate: number;
    modificationNumber: number;
    appInfoID: number;
    sortInfoID: number;
    type: string;
    creator: string;
    uniqueIDseed: number;
    nextRecordListID: number;
    recordsNumber: number;

    constructor(view: DataView, startOffset: number) {
        super(view);

        this.offset = startOffset
        this.init();
    }

    init() {
        this.name = (this.readString(32)).replace(/\x00+$/, '');
        this.attributes = this.readUint16();
        this.version = this.readUint16();
        this.creationDate = this.readUint32();
        this.modificationDate = this.readUint32();
        this.lastBackupDate = this.readUint32();
        this.modificationNumber = this.readUint32();
        this.appInfoID = this.readUint32();
        this.sortInfoID = this.readUint32();
        this.type = this.readString(4);
        this.creator = this.readString(4);
        this.uniqueIDseed = this.readUint32();
        this.nextRecordListID = this.readUint32();
        this.recordsNumber = this.readUint16();
    }
}