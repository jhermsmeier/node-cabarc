/**
 * Cabinet Folder
 * @constructor
 * @memberOf Cabinet
 * @returns {Folder}
 */
function Folder() {

  if( !(this instanceof Folder) )
    return new Folder()

  this.dataOffset = 0x00000000
  this.blockCount = 0x0000
  this.compressionType = 0x0000
  this.appData = null

}

/**
 * Folder structure base size in bytes
 * @type {Number}
 */
Folder.size = 8

/**
 * Parse a Cabinet Folder from a buffer
 * @param {Buffer} buffer
 * @param {Number} [offset=0]
 * @returns {Folder}
 */
Folder.parse = function( buffer, offset ) {
  return new Folder().parse( buffer, offset )
}

/**
 * Folder prototype
 * @type {Object}
 * @ignore
 */
Folder.prototype = {

  constructor: Folder,

  /**
   * Parse a Cabinet Folder from a buffer
   * @param {Buffer} buffer
   * @param {Number} [offset=0]
   * @returns {Folder}
   */
  parse( buffer, offset ) {

    offset = offset || 0

    this.dataOffset = buffer.readUInt32LE( offset + 0 )
    this.blockCount = buffer.readUInt16LE( offset + 4 )
    this.compressionType = buffer.readUInt16LE( offset + 6 )

    // TODO: abReserve
    // this.appData = null

    return this

  },

  /**
   * Write the Cabinet Folder to a buffer
   * @param {Buffer} [buffer]
   * @param {Number} [offset=0]
   * @return {Buffer}
   */
  toBuffer( buffer, offset ) {

    buffer = buffer || Buffer.alloc( Folder.size )
    offset = offset || 0

    return buffer

  }

}

module.exports = Folder
