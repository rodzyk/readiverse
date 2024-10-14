

import { LZ77Decompressor } from "../lz77";
import { Uint8ArrayCombiner } from "../common";
import { ExthHeader } from "./exth-header";
import { MobiHeader } from "./mobi-header";
import { PalmDocHeader } from "./palm-doc-header";
import { PdbHeader } from "./pdb-header";
import { PdbRecord, PdbRecords } from "./pdb-records";

export class MobiFileReader {
    view: DataView;
    pdbHeader: PdbHeader;
    reclist: PdbRecord[];
    palmDOCHeader: PalmDocHeader;
    mobiHeader: MobiHeader;
    exthHeader: ExthHeader;
    // indexMetaRecord: IndexMetaRecord;

    constructor(view: DataView) {
        this.view = view

        this.init();
    }

    init() {
        const v = this.view
        // 1) parse Palm Database Header
        this.pdbHeader = new PdbHeader(v, 0);

        // 2) parse Palm Database Records
        const pdbRec = new PdbRecords(v, this.pdbHeader.offset)
        this.reclist = pdbRec.parse(this.pdbHeader.recordsNumber);

        // 3) parse PalmDOC Header
        this.palmDOCHeader = new PalmDocHeader(v, this.reclist[0].dataOffset);

        // 4) parse Mobi Header
        this.mobiHeader = new MobiHeader(v, this.palmDOCHeader.offset)

        // 5) parse EXTH Header
        this.exthHeader = new ExthHeader(v, this.mobiHeader.offset)

        // 7) parseIndexMetaRecord()
        // const lastTextRec = this.reclist[this.palmDOCHeader.recordCount + 1];
        // this.indexMetaRecord = new IndexMetaRecord(v, lastTextRec.dataOffset);

        // 8) TAGX section
        // TODO
    }

    getCoverImageIndex() {
        return this.exthHeader.records.get(201);
    }

    readImage(imageIndex: number): Blob | undefined {
        const firstImageIndex = this.mobiHeader.firstImageIndex;
        const begin = this.reclist[firstImageIndex + imageIndex].dataOffset;
        const end = this.reclist[firstImageIndex + imageIndex + 1].dataOffset;

        if (!begin || !end) return

        const data = new Uint8Array(this.view.buffer.slice(begin, end))

        const imageTypes = [
            { type: 'image/jpeg', check: (d: Uint8Array) => d[0] === 0xFF && d[1] === 0xD8 },
            { type: 'image/png', check: (d: Uint8Array) => d[0] === 0x89 && d[1] === 0x50 },
            { type: 'image/gif', check: (d: Uint8Array) => d[0] === 0x47 && d[1] === 0x49 && d[2] === 0x46 },
            { type: 'image/bmp', check: (d: Uint8Array) => d[0] === 0x42 && d[1] === 0x4D },
            {
                type: 'image/tiff', check: (d: Uint8Array) =>
                    (d[0] === 0x49 && d[1] === 0x20 && d[2] === 0x49) ||
                    (d[0] === 0x4D && d[1] === 0x5A)
            },
            { type: 'image/webp', check: (d: Uint8Array) => d[0] === 0x38 && d[1] === 0x42 }
        ];

        const imageType = imageTypes.find(({ check }) => check(data))?.type || 'unknown';

        return new Blob([data.buffer], { type: imageType });
    }

    readText(): Uint8Array {
        const lastTextRec = this.palmDOCHeader.recordCount;
        const buffers = [];

        for (let i = 1; i <= lastTextRec; i++) {
            buffers.push(this.readTextRecord(i));
        }

        const combiner = new Uint8ArrayCombiner(buffers)

        return combiner.combine()
    }

    readTextRecord(i: number): Uint8Array {
        const flags = this.mobiHeader.extraRecordDataFlags;
        const begin = this.reclist[i].dataOffset;
        const end = this.reclist[i + 1].dataOffset;

        if (!begin || !end) return new Uint8Array([])

        let data: Uint8Array = new Uint8Array(this.view.buffer.slice(begin, end))
        const extrasize = PdbRecords.getRecordExtrasize(data, flags);

        data = new Uint8Array(this.view.buffer.slice(begin, end - extrasize));

        if (this.palmDOCHeader.compression === 2) {
            const buffer = new LZ77Decompressor(data).decompress();

            return buffer
        } else {
            return data;
        }
    }

}

/**
 * WIKI
 * https://wiki.mobileread.com/wiki/PDB
 * https://wiki.mobileread.com/wiki/MOB
 */