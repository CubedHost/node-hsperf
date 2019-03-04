const { readUInt64 } = require('./utils');
const MAGIC = 0xcafec0c0;

class Prologue {

  constructor(fields = {}) {
    this.magic = MAGIC;
    this.byteOrder = fields.byteOrder;
    this.majorVersion = fields.majorVersion;
    this.minorVersion = fields.minorVersion;
    this.accessible = fields.accessible;
    this.used = fields.used;
    this.overflow = fields.overflow;
    this.modTimestamp = fields.modTimeStamp;
    this.entryOffset = fields.entryOffset;
    this.numEntries = fields.numEntries;
  }

  static from(data) {
    if (!Buffer.isBuffer(data)) {
      throw new Error('Data must be a buffer');
    }

    // Check for correct length
    if (data.length < 32) {
      throw new Error('Data must be at least 32 bytes long');
    }

    // Copy prologue section of original data
    const buffer = Buffer.alloc(32);
    data.copy(buffer, 0, 0, 32);

    // Check for magic bytes
    let magic = buffer.readUInt32BE(0);
    if (magic !== MAGIC) {
      throw new Error('Invalid hsperfdata: bad magic ' + magic.toString(8));
    }

    const prologue = new Prologue();
    let offset = 4;

    // Set byte order: little endian or big endian
    prologue.byteOrder = buffer.readInt8(offset);
    offset += 1;

    const bigEndian = prologue.byteOrder === 0;

    // MajorVersion int8
    prologue.majorVersion = buffer.readInt8(offset);
    offset += 1;

    // MinorVersion int8
    prologue.minorVersion = buffer.readInt8(offset);
    offset += 1;

    // Accessible int8
    prologue.accessible = buffer.readInt8(offset);
    offset += 1;

    // Used int32
    prologue.used = bigEndian ?
      buffer.readUInt32BE(offset) : buffer.readUInt32LE(offset);
    offset += 4;

    // Overflow int32
    prologue.overflow = bigEndian ?
      buffer.readUInt32BE(offset) : buffer.readUInt32LE(offset);
    offset += 4;

    // ModTimeStamp int64
    prologue.modTimestamp = readUInt64(buffer, offset, bigEndian);
    offset += 8;

    // EntryOffset int32
    prologue.entryOffset = bigEndian ?
      buffer.readUInt32BE(offset) : buffer.readUInt32LE(offset);
    offset += 4;

    // NumEntries int32
    prologue.numEntries = bigEndian ?
      buffer.readUInt32BE(offset) : buffer.readUInt32LE(offset);
    offset += 4;

    return prologue;
  }

}

Prologue.MAGIC = MAGIC;
module.exports = Prologue;
