export class BinaryFormatReader {
    protected view: DataView
    offset: number;

    constructor(view: DataView, offset: number = 0) {
        this.view = view;
        this.offset = offset;
    }

    protected checkBounds(length: number) {
        if (this.offset + length > this.view.buffer.byteLength) {
            throw new Error(`Reading exceeds buffer length. Attempted to read ${length} bytes at offset ${this.offset}, but buffer length is ${this.view.buffer.byteLength}.`);
        }
    }

    protected readUint8() {
        this.checkBounds(1);
        const value = this.view.getUint8(this.offset);
        this.skip(1)
        return value;
    }

    protected readUint16() {
        this.checkBounds(2);
        const value = this.view.getUint16(this.offset);
        this.skip(2)
        return value;
    }

    protected readUint32() {
        this.checkBounds(4);
        const value = this.view.getUint32(this.offset);
        this.skip(4)
        return value;
    }

    protected readString(length: number) {
        const b = this.getBuffer(this.offset, length);
        const v = new TextDecoder("utf-8").decode(b);
        this.skip(length)
        return v;
    }

    protected getBuffer(offset: number, length: number) {
        if (offset + length > this.view.buffer.byteLength || offset < 0) {
            const errMsg = `Reading exceeds buffer length at offset ${offset} for length ${length}.`
            throw new Error(errMsg);
        }
        return this.view.buffer.slice(offset, offset + length);
    }

    protected seek(offset: number) {
        if (offset < 0 || offset >= this.view.buffer.byteLength) {
            throw new Error(`Invalid seek offset: ${offset}. Buffer length is ${this.view.buffer.byteLength}.`);
        }
        this.offset = offset;
    }

    protected tell() {
        return this.offset;
    }

    protected skip(length: number) {
        const skip = this.tell() + length;
        this.seek(skip);
    }

    protected reset() {
        this.offset = 0;
    }

}