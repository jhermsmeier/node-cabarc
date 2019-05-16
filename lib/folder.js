/**
 * Cabinet Folder (struct CFFOLDER)
 * @constructor
 * @memberOf Cabinet
 * @returns {CFFolder}
 */
function CFFolder() {

  if( !(this instanceof CFFolder) )
    return new CFFolder()

  /** @type {Number} Offset of the first `CFDATA` block in this folder */
  this.dataOffset = 0x00000000
  /** @type {Number} Number of `CFDATA` blocks in this folder */
  this.blockCount = 0x0000
  /** @type {Number} Compression used (see `Cabinet.COMPRESSION`) */
  this.compressionType = 0x0000
  /** @type {Buffer} Per folder reserved area (optional) */
  this.reserved = Buffer.alloc( 0 )

}

/**
 * Folder structure base size in bytes
 * @type {Number}
 */
CFFolder.SIZE = 8

/**
 * Parse a Cabinet Folder from a buffer
 * @param {Buffer} buffer
 * @param {Number} [offset=0]
 * @returns {CFFolder}
 */
CFFolder.parse = function( buffer, offset ) {
  return new CFFolder().parse( buffer, offset )
}

/**
 * CFFolder prototype
 * @type {Object}
 * @ignore
 */
CFFolder.prototype = {

  constructor: CFFolder,

  /**
   * Parse a Cabinet Folder from a buffer
   * @param {Buffer} buffer
   * @param {Number} [offset=0]
   * @returns {CFFolder}
   */
  parse( buffer, offset ) {

    offset = offset || 0

    this.dataOffset = buffer.readUInt32LE( offset + 0 )
    this.blockCount = buffer.readUInt16LE( offset + 4 )
    this.compressionType = buffer.readUInt16LE( offset + 6 )

    // TODO: reserved
    // this.reserved = null

    return this

  },

  /**
   * Write the Cabinet Folder to a buffer
   * @param {Buffer} [buffer]
   * @param {Number} [offset=0]
   * @return {Buffer}
   */
  write( buffer, offset ) {

    buffer = buffer || Buffer.alloc( CFFolder.SIZE )
    offset = offset || 0

    throw new Error( 'Not implemented' )

    return buffer

  }

}

module.exports = CFFolder
