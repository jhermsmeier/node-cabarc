/**
 * Cabinet BlockHeader
 * @constructor
 * @memberOf Cabinet
 * @returns {BlockHeader}
 */
function BlockHeader() {

  if( !(this instanceof BlockHeader) )
    return new BlockHeader()

  this.checksum = 0x00000000
  this.size = 0x0000
  this.uncompressedSize = 0x0000
  this.appData = null
  this.data = null

}

/**
 * Data block header structure base size in bytes
 * NOTE: This does not include `appData` nor `data` byte counts
 * @type {Number}
 */
BlockHeader.size = 8

/**
 * Parse a Cabinet BlockHeader from a buffer
 * @param {Buffer} buffer
 * @param {Number} [offset=0]
 * @returns {BlockHeader}
 */
BlockHeader.parse = function( buffer, offset ) {
  return new BlockHeader().parse( buffer, offset )
}

/**
 * BlockHeader prototype
 * @type {Object}
 * @ignore
 */
BlockHeader.prototype = {

  constructor: BlockHeader,

  /**
   * Parse a Cabinet BlockHeader from a buffer
   * @param {Buffer} buffer
   * @param {Number} [offset=0]
   * @returns {BlockHeader}
   */
  parse( buffer, offset ) {

    offset = offset || 0

    this.checksum = buffer.readUInt32LE( offset + 0 )
    this.size = buffer.readUInt16LE( offset + 4 )
    this.uncompressedSize = buffer.readUInt16LE( offset + 6 )
    this.appData = null
    this.data = null

    return this

  },

  /**
   * Write the Cabinet BlockHeader to a buffer
   * @param {Buffer} [buffer]
   * @param {Number} [offset=0]
   * @return {Buffer}
   */
  toBuffer( buffer, offset ) {

    buffer = buffer || Buffer.alloc( BlockHeader.size )
    offset = offset || 0

    return buffer

  }

}

module.exports = BlockHeader
