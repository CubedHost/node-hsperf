exports.readUInt64 = function (buffer, offset, bigEndian) {
  if (bigEndian) {
    return (buffer.readUInt32BE(offset) << 8) + buffer.readUInt32BE(offset + 4);
  }

  return (buffer.readUInt32LE(offset + 4) << 8) + buffer.readUInt32LE(offset);
}
