class CFData {

  constructor( reserveLength ) {

    /** @type {Number} Checksum of this CFDATA entry */
    this.checksum = 0x00000000
    /** @type {Number} Number of compressed bytes in this block */
    this.compressedLength = 0
    /** @type {Number} Number of uncompressed bytes in this block */
    this.uncompressedLength = 0
    /** @type {Buffer} Per-datablock reserved area (optional) */
    this.reserved = Buffer.alloc( reserveLength || 0 )
    /** @type {Buffer} Compressed data bytes */
    this.data = null

  }

  static parse( buffer, offset ) {
    return new CFData().parse( buffer, offset )
  }

  encodingLength() {
    return CFData.SIZE +
      ( this.reserved ? this.reserved.length : 0 ) +
      ( this.data ? this.data.length : 0 )
  }

  parse( buffer, offset ) {

    offset = offset || 0

    this.checksum = buffer.readUInt32LE( offset + 0 )
    this.compressedLength = buffer.readUInt16LE( offset + 4 )
    this.uncompressedLength = buffer.readUInt16LE( offset + 6 )

    if( this.reserved.length ) {
      buffer.copy( this.reserved, 0, offset + CFData.SIZE, offset + CFData.SIZE + this.reserved.length )
    }

    // Copy block data if source buffer is large enough to contain it
    if( ( buffer.length - offset ) >= ( CFData.SIZE + this.reserved.length + this.compressedLength ) ) {
      this.data = Buffer.alloc( this.compressedLength )
      buffer.copy( this.data, 0, offset + CFData.SIZE )
    } else {
      this.data = null
    }

    return this

  }

}

CFData.SIZE = 8

CFData.MAX_RESERVE_SIZE = 255

CFData.MAX_DATA_SIZE = 32768 + 6144

CFData.MAX_SIZE = CFData.SIZE + CFData.MAX_RESERVE_SIZE + CFData.MAX_DATA_SIZE

module.exports = CFData
