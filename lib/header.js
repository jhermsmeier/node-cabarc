var Cabinet = require( './cabinet' )

/**
 * Cabinet Header
 * @constructor
 * @memberOf Cabinet
 * @returns {Header}
 */
function Header() {

  if( !(this instanceof Header) )
    return new Header()

  this.signature = Cabinet.SIGNATURE
  this.reserved1 = 0x00000000
  this.archiveSize = 0x00000000
  this.reserved2 = 0x00000000
  this.fileOffset = 0x00000000
  this.reserved3 = 0x00000000
  this.versionMinor = 0x00
  this.versionMajor = 0x00
  this.folderCount = 0x0000
  this.fileCount = 0x0000
  this.flags = 0x0000
  this.setId = 0x0000
  this.number = 0x0000

  // Optional fields
  this.headerData = 0x0000
  this.folderData = 0x00
  this.blockData = 0x00

  this.data = null
  this.previous = null
  this.previousDisk = null
  this.next = null
  this.nextDisk = null

  // TODO: Adjust this based on optional fields
  /** @type {Number} Header size */
  this.size = 36

}

/**
 * If set, file is not the first in a set,
 * and `szCabinetPrev` and `szDiskPrev`
 * are present in the header
 * @const {Number}
 */
Header.PREV_CABINET = 0x0001

/**
 * If set, file is not the last in a set,
 * and `szCabinetNext` and `szDiskNext`
 * are present in the header
 * @const {Number}
 */
Header.NEXT_CABINET = 0x0002

/**
 * If set, file contains only reserved fields,
 * and `cbCFHeader`, `cbCFFolder` and `cbCFData`
 * are present in the header
 * @const {Number}
 */
Header.RESERVE_CABINET = 0x0004

/**
 * Parse a Cabinet Header from a buffer
 * @param {Buffer} buffer
 * @param {Number} [offset=0]
 * @returns {Header}
 */
Header.parse = function( buffer, offset ) {
  return new Header().parse( buffer, offset )
}

/**
 * Header prototype
 * @type {Object}
 * @ignore
 */
Header.prototype = {

  constructor: Header,

  /**
   * Parse a Cabinet Header from a buffer
   * @param {Buffer} buffer
   * @param {Number} [offset=0]
   * @returns {Header}
   */
  parse( buffer, offset ) {

    offset = offset || 0

    this.signature = buffer.readUInt32LE( offset + 0 )

    if( this.signature !== Cabinet.SIGNATURE ) {
      throw new Error( `Invalid signature: Expected 0x4643534d, saw 0x${this.signature.toString(16)}` )
    }

    this.reserved1 = buffer.readUInt32LE( offset + 4 )
    this.archiveSize = buffer.readUInt32LE( offset + 8 )
    this.reserved2 = buffer.readUInt32LE( offset + 12 )
    this.fileOffset = buffer.readUInt32LE( offset + 16 )
    this.reserved3 = buffer.readUInt32LE( offset + 20 )
    this.versionMinor = buffer.readUInt8( offset + 24 )
    this.versionMajor = buffer.readUInt8( offset + 25 )
    this.folderCount = buffer.readUInt16LE( offset + 26 )
    this.fileCount = buffer.readUInt16LE( offset + 28 )
    this.flags = buffer.readUInt16LE( offset + 30 )
    this.setId = buffer.readUInt16LE( offset + 32 )
    this.number = buffer.readUInt16LE( offset + 34 )

    // TODO: Optional fields
    this.headerData = this.flags & Header.RESERVE_CABINET ?
      buffer.readUInt16LE( offset + 36 ) : 0

    this.folderData = this.flags & Header.RESERVE_CABINET ?
      buffer.readUInt8( offset + 38 ) : 0

    this.blockData = this.flags & Header.RESERVE_CABINET ?
      buffer.readUInt8( offset + 39 ) : 0

    // this.data = null
    // this.previous = null
    // this.previousDisk = null
    // this.next = null
    // this.nextDisk = null

    return this

  },

  /**
   * Write the Cabinet Header to a buffer
   * @param {Buffer} [buffer]
   * @param {Number} [offset=0]
   * @return {Buffer}
   */
  toBuffer( buffer, offset ) {

    buffer = buffer || Buffer.alloc( Header.size )
    offset = offset || 0

    return buffer

  }

}

module.exports = Header
