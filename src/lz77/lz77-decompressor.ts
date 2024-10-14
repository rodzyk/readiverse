export class LZ77Decompressor {
    protected data: Uint8Array
    protected length: number
    protected offset: number;
    protected buffer: number[];
    
    constructor(data: Uint8Array) {
        this.data = data;
        this.length = data.length;
        this.offset = 0;
        this.buffer = [];
    }

    decompress(): Uint8Array {
        while (this.offset < this.length) {
            const char: number = this.readByte();

            if (char === 0) {
                this.buffer.push(char);
            } else if (char <= 8) {
                this.writeLiteral(char);
            } else if (char <= 0x7f) {
                this.buffer.push(char);
            } else if (char <= 0xbf) {
                this.writeBackReference(char);
            } else {
                this.writeSpecial(char);
            }
        }
        return new Uint8Array(this.buffer);
    }

    protected readByte() {
        return this.data[this.offset++];
    }

    protected writeLiteral(count: number) {
        for (let i = 0; i < count; i++) {
            this.buffer.push(this.readByte());
        }
    }

    protected writeBackReference(char: number) {
        const next = this.readByte();
        const distance = ((char << 8 | next) >> 3) & 0x7ff;
        const lzLength = (next & 0x7) + 3;

        const bufferSize = this.buffer.length;
        for (let i = 0; i < lzLength; i++) {
            this.buffer.push(this.buffer[bufferSize - distance + i]);
        }
    }

    protected writeSpecial(char: number) {
        this.buffer.push(32);
        this.buffer.push(char ^ 0x80);
    }
}