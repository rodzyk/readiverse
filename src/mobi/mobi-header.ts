import { BinaryFormatReader } from "../common";

export class MobiHeader extends BinaryFormatReader {
    identifier: string;
    headerLength: number;
    mobiType: number;
    textEncoding: number;
    uniqueID: number;
    fileVersion: number;
    ortographicIndex: number;
    inflectionIndex: number;
    indexNames: number;
    indexKeys: number;
    extraIndex0: number;
    extraIndex1: number;
    extraIndex2: number;
    extraIndex3: number;
    extraIndex4: number;
    extraIndex5: number;
    firstNonBookIndex: number;
    fullNameOffset: number;
    fullNameLength: number;
    locale: number;
    inputLanguage: number;
    outputLanguage: number;
    minVersion: number;
    firstImageIndex: number;
    huffmanRecordOffset: number;
    huffmanRecordCount: number;
    huffmanTableOffset: number;
    huffmanTableLength: number;
    EXTHflags: number;
    DRMOffset: number;
    DRMCount: number;
    DRMSize: number;
    DRMFlags: number;
    firstContentRecordNumber: number;
    lastContentRecordNumber: number;
    FCISRecordNumber: number;
    FCISRecordCount: number;
    FLISRecordNumber: number;
    firstCompilationDataSectionCount: number;
    numberOfCompilationDataSections: number;
    extraRecordDataFlags: number;
    INDXRecordOffset: number;
    constructor(view: DataView, startOffset: number) {
        super(view);

        this.offset = startOffset
        this.init();
    }

    init() {
        const startOffset = this.tell();


        this.identifier = this.readString(4)
        this.headerLength = this.readUint32()
        this.mobiType = this.readUint32()
        this.textEncoding = this.readUint32() // 65001 = UTF-8
        this.uniqueID = this.readUint32()
        this.fileVersion = this.readUint32()
        
        this.ortographicIndex = this.readUint32()
        this.inflectionIndex = this.readUint32()
        this.indexNames = this.readUint32()
        this.indexKeys = this.readUint32()
        this.extraIndex0 = this.readUint32()
        this.extraIndex1 = this.readUint32()
        this.extraIndex2 = this.readUint32()
        this.extraIndex3 = this.readUint32()
        this.extraIndex4 = this.readUint32()
        this.extraIndex5 = this.readUint32()

        this.firstNonBookIndex = this.readUint32()
        this.fullNameOffset = this.readUint32()
        this.fullNameLength = this.readUint32()
        this.locale = this.readUint32()
        this.inputLanguage = this.readUint32()
        this.outputLanguage = this.readUint32()
        this.minVersion = this.readUint32()
        this.firstImageIndex = this.readUint32()
        this.huffmanRecordOffset = this.readUint32()
        this.huffmanRecordCount = this.readUint32()
        this.huffmanTableOffset = this.readUint32()
        this.huffmanTableLength = this.readUint32()
        this.EXTHflags = this.readUint32()
        // this.outputLanguage = this.readUint32()

        this.skip(32); //32 unknown bytes, if MOBI is long enough

        this.skip(4); // Unknown | Use 0xFFFFFFFF

        this.DRMOffset = this.readUint32()
        this.DRMCount = this.readUint32()
        this.DRMSize = this.readUint32()
        this.DRMFlags = this.readUint32()

        // 
        this.skip(8); // Bytes to the end of the MOBI header, including the following if the header length >= 228 (244 from start of record). Use 0x0000000000000000.

        this.firstContentRecordNumber = this.readUint16()
        this.lastContentRecordNumber = this.readUint16()

        this.skip(4); // Unknown	Use 0x00000001.

        this.FCISRecordNumber = this.readUint32();
        this.FCISRecordCount = this.readUint32();  // Unknown

        this.FLISRecordNumber = this.readUint32();
        this.FLISRecordNumber = this.readUint32(); // Unknown

        this.skip(8); // Use 0x0000000000000000
        this.skip(4); // Use 0xFFFFFFFF.

        this.firstCompilationDataSectionCount = this.readUint32();
        this.numberOfCompilationDataSections = this.readUint32();

        this.skip(4); // Use 0xFFFFFFFF.//56
        this.skip(2) // ?
        /**
         * A set of binary flags, some of which indicate extra data at the end of each text block. 
         * This only seems to be valid for Mobipocket format version 5 and 6 (and higher?), when the 
         * header length is 228 (0xE4) or 232 (0xE8).
         *   bit 1 (0x1): <extra multibyte bytes><size>
         *   bit 2 (0x2): <TBS indexing description of this HTML record><size>
         *   bit 3 (0x4): <uncrossable breaks><size>
         * Setting bit 2 (0x2) disables <guide><reference type="start"> functionality.
         */
        this.extraRecordDataFlags = this.readUint16();

        this.INDXRecordOffset = this.readUint32(); // (If not 0xFFFFFFFF)The record number of the first INDX record created from an ncx file.

        this.skip(4); // 0xFFFFFFFF In new MOBI file, the MOBI header length is 256, skip this to EXTH header.
        this.skip(4);// 0xFFFFFFFF In new MOBI file, the MOBI header length is 256, skip this to EXTH header.
        this.skip(4); // 0xFFFFFFFF In new MOBI file, the MOBI header length is 256, skip this to EXTH header.
        this.skip(4); // 0xFFFFFFFF In new MOBI file, the MOBI header length is 256, skip this to EXTH header.
        this.skip(4); // 0xFFFFFFFF In new MOBI file, the MOBI header length is 256, skip this to EXTH header.
        this.skip(4); // 0 In new MOBI file, the MOBI header length is 256, skip this to EXTH header, MOBI Header length 256, and add 12 bytes from PalmDOC Header so this index is 268.

        this.seek(startOffset + this.headerLength)

    }
}