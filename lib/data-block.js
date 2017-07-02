/**
 * Cabinet DataBlock
 * @constructor
 * @memberOf Cabinet
 * @returns {DataBlock}
 */
function DataBlock() {

  if( !(this instanceof DataBlock) )
    return new DataBlock()

  this.checksum = 0x00000000
  this.size = 0x0000
  this.uncompressedSize = 0x0000
  this.appData = null
  this.data = null

}

/**
 * Parse a Cabinet DataBlock from a buffer
 * @param {Buffer} buffer
 * @param {Number} [offset=0]
 * @returns {DataBlock}
 */
DataBlock.parse = function( buffer, offset ) {
  return new DataBlock().parse( buffer, offset )
}

/**
 * DataBlock prototype
 * @type {Object}
 * @ignore
 */
DataBlock.prototype = {

  constructor: DataBlock,

  /**
   * Parse a Cabinet DataBlock from a buffer
   * @param {Buffer} buffer
   * @param {Number} [offset=0]
   * @returns {DataBlock}
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
   * Write the Cabinet DataBlock to a buffer
   * @param {Buffer} [buffer]
   * @param {Number} [offset=0]
   * @return {Buffer}
   */
  toBuffer( buffer, offset ) {

    buffer = buffer || Buffer.alloc( DataBlock.size )
    offset = offset || 0

    return buffer

  }

}

module.exports = DataBlock
