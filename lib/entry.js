const { readUInt64 } = require('./utils');

class Entry {

  constructor(fields = {}) {
    this.name = fields.name;
    this.value = fields.value;
    this.length = fields.length;
    this.nameOffset = fields.nameOffset;
    this.vectorLength = fields.vectorLength;
    this.dataType = fields.dataType;
    this.flags = fields.flags;
    this.dataUnits = fields.dataUnits;
    this.dataVariability = fields.dataVariability;
    this.dataOffset = fields.dataOffset;
  }

  static from(data, prologue) {
    if (!Buffer.isBuffer(data)) {
      throw new Error('Data must be a buffer');
    }

    const {
      byteOrder,
      entryOffset,
      numEntries
    } = prologue;

    const bigEndian = byteOrder === 0;

    // Copy original data minus prologue
    const buffer = Buffer.alloc(data.length - entryOffset);
    data.copy(buffer, 0, entryOffset, buffer.length);

    const entries = [];
    let offset = 0;

    for (let i = 0; i < numEntries; i++) {
      const entry = new Entry();

      // EntryLength int32
      entry.length = bigEndian ?
        buffer.readUInt32BE(offset) : buffer.readUInt32LE(offset);
      offset += 4;

      // NameOffset int32
      entry.nameOffset = bigEndian ?
        buffer.readUInt32BE(offset) : buffer.readUInt32LE(offset);
      offset += 4;

      // VectorLength int32
      entry.vectorLength = bigEndian ?
        buffer.readUInt32BE(offset) : buffer.readUInt32LE(offset);
      offset += 4;

      // DataType int8
      entry.dataType = buffer.readInt8(offset);
      entry.dataType = String.fromCharCode(entry.dataType);
      offset += 1;

      // Flags int8
      entry.flags = buffer.readInt8(offset);
      offset += 1;

      // DataUnits int8
      entry.dataUnits = buffer.readInt8(offset);
      offset += 1;

      // DataVariability int8
      entry.dataVariability = buffer.readInt8(offset);
      offset += 1;

      // DataOffset int32
      entry.dataOffset = bigEndian ?
        buffer.readUInt32BE(offset) : buffer.readUInt32LE(offset);
      offset += 4;

      // EntryName string
      const nameLength = entry.dataOffset - entry.nameOffset;
      entry.name = buffer
        .slice(offset, offset + nameLength)
        .toString()
        .replace(/\0+$/, '');
      offset += nameLength;

      // Value string or int64
      if (entry.dataType === 'B') {
        const stringValueLength = entry.length - entry.dataOffset;
        entry.value = buffer
          .slice(offset, offset + stringValueLength)
          .toString()
          .replace(/\0+$/, '');
        offset += stringValueLength;
      } else if (entry.dataType === 'J') {
        entry.value = readUInt64(buffer, offset, bigEndian);
        offset += 8;
      }

      entries.push(entry);
    }

    return entries;
  }

}

module.exports = Entry;
