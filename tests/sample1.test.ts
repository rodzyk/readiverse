import { MobiFileReader } from '../src';
import * as fs from 'fs';
import * as path from 'path';

const FILE_NAME = path.join(__dirname, '../assets/sample1.mobi');
const TEST_OUTDIR = path.join(__dirname, 'test-output');

describe('MobiFileReader', () => {

    let mobi: MobiFileReader;

    beforeEach(() => {
        const fileBuffer = fs.readFileSync(FILE_NAME);
        const view = new DataView(fileBuffer.buffer);
        mobi = new MobiFileReader(view);

    });

    it('should read and parse MOBI file', () => {
        expect(mobi).toBeDefined();
        expect(mobi.pdbHeader).toBeDefined();
        expect(mobi.reclist).toBeDefined();
        expect(mobi.palmDOCHeader).toBeDefined();
        expect(mobi.mobiHeader).toBeDefined();
        expect(mobi.exthHeader).toBeDefined();
    });

    it('should have correct number of records in the MOBI file', () => {
        expect(mobi.reclist.length).toBeGreaterThan(0);
    });

    it('should parse MOBI Header correctly', () => {
        expect(mobi.mobiHeader.identifier).toBeDefined();
        expect(mobi.mobiHeader.identifier).toBe("MOBI");
    });

    it('should parse EXTH metadata correctly', () => {
        expect(mobi.exthHeader.identifier).toBeDefined();
        expect(mobi.exthHeader.identifier).toBe("EXTH");
    });

    it('should parse metadata from MOBI file', () => {
        expect(mobi.pdbHeader.name).toBeDefined();
        expect(mobi.pdbHeader.name).toBe('The_Geography_of_Bliss__One_Gru');
    });

    it('should return the content of the MOBI file', () => {
        const content = mobi.readText();
        expect(content).toBeDefined();
        expect(content.length).toBeGreaterThan(0);

        const td = new TextDecoder();
        const text = td.decode(content)
        fs.writeFileSync(TEST_OUTDIR + '/sample1-content.html', text);
    });

    // it('should parse Index Meta Records correctly', () => {
    //     expect(mobi.indexMetaRecord.identifier).toBeDefined();
    //     expect(mobi.indexMetaRecord.identifier).toBe("INDX");
    // });

});
