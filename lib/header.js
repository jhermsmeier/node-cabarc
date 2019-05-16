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

  /** @type {Number} Cabinet file signature */
  this.signature = Cabinet.SIGNATURE
  /** @type {Number} Reserved */
  this.reserved1 = 0x00000000
  /** @type {Number} Size of this cabinet file in bytes */
  this.archiveSize = 0x00000000
  /** @type {Number} Reserved */
  this.reserved2 = 0x00000000
  /** @type {Number} Offset of the first `CFFILE` entry */
  this.fileOffset = 0x00000000
  /** @type {Number} Reserved */
  this.reserved3 = 0x00000000
  /** @type {Number} Cabinet file format version, minor */
  this.versionMinor = 0x00
  /** @type {Number} Cabinet file format version, major */
  this.versionMajor = 0x00
  /** @type {Number} Number of `CFFOLDER` entries in this cabinet */
  this.folderCount = 0x0000
  /** @type {Number} Number of `CFFILE` entries in this cabinet */
  this.fileCount = 0x0000
  /** @type {Number} Cabinet file option indicators */
  this.flags = 0x0000
  /** @type {Number} Must be the same for all cabinets in a set */
  this.setId = 0x0000
  /** @type {Number} Number of this cabinet file in a set */
  this.number = 0x0000

  // Optional fields

  /** @type {Number} Size of per-cabinet reserved area (optional) */
  this.headerData = 0x0000
  /** @type {Number} Size of per-folder reserved area (optional) */
  this.folderData = 0x00
  /** @type {Number} Size of per-datablock reserved area (optional) */
  this.blockData = 0x00

  /** @type {Buffer} Per-cabinet reserved area (optional) */
  this.data = null

  /** @type {String} Name of previous cabinet file (optional) */
  this.previous = null
  /** @type {String} Name of previous disk (optional) */
  this.previousDisk = null
  /** @type {String} Name of next cabinet file (optional) */
  this.next = null
  /** @type {String} Name of next disk (optional) */
  this.nextDisk = null

  /** @type {Number} Size of the header structure in bytes */
  this.byteLength = 0

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
Header.RESERVE_PRESENT = 0x0004

/**
 * Header structure size in bytes
 * NOTE: This is the base size, and doesn't include
 * additional / optional `headerData` bytes
 * @type {Number}
 */
Header.size = 36

/**
 * Maximum header structure length in bytes
 * (Required + Optional + Prev/Next strings[255 + NUL])
 * @type {Number}
 */
Header.MAX_SIZE = Header.size + 4 + ( 4 * 256 )

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
   * Get the number of bytes needed to encode the headerr
   * @return {Number} byteLength
   */
  encodingLength() {

    var byteLength = Header.size

    if( this.flags & Header.RESERVE_PRESENT ) {
      byteLength += 4
    }

    if( this.flags & Header.PREV_CABINET ) {
      byteLength += Buffer.byteLength( this.previous ) + 1
      byteLength += Buffer.byteLength( this.previousDisk ) + 1
    }

    if( this.flags & Header.NEXT_CABINET ) {
      byteLength += Buffer.byteLength( this.next ) + 1
      byteLength += Buffer.byteLength( this.nextDisk ) + 1
    }

    return byteLength

  },

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

    // Optional fields

    if( this.flags & Header.RESERVE_PRESENT ) {

      offset += 36

      this.headerData = buffer.readUInt16LE( offset )
      this.folderData = buffer.readUInt8( offset += 2 )
      this.blockData = buffer.readUInt8( offset += 1 )

    } else {
      this.headerData = 0
      this.folderData = 0
      this.blockData = 0
    }

    if( this.headerData ) {
      this.data = Buffer.alloc( this.headerData )
      buffer.copy( this.data, 0, offset, offset + this.headerData )
      offset += this.headerData
    } else {
      this.data = null
    }

    if( this.flags & Header.PREV_CABINET ) {
      var eos = buffer.indexOf( 0x00, offset )
      this.previous = buffer.toString( 'ascii', offset, eos )
      offset = eos + 1
      eos = buffer.indexOf( 0x00, offset )
      this.previousDisk = buffer.toString( 'ascii', offset, eos )
      offset = eos + 1
    } else {
      this.previous = null
      this.previousDisk = null
    }

    if( this.flags & Header.NEXT_CABINET ) {
      var eos = buffer.indexOf( 0x00, offset )
      this.next = buffer.toString( 'ascii', offset, eos )
      offset = eos + 1
      eos = buffer.indexOf( 0x00, offset )
      this.nextDisk = buffer.toString( 'ascii', offset, eos )
      offset = eos + 1
    } else {
      this.next = null
      this.nextDisk = null
    }

    this.byteLength = offset || Header.size

    return this

  },

  /**
   * Write the Cabinet Header to a buffer
   * @param {Buffer} [buffer]
   * @param {Number} [offset=0]
   * @return {Buffer}
   */
  write( buffer, offset ) {

    buffer = buffer || Buffer.alloc( Header.size )
    offset = offset || 0

    return buffer

  }

}

module.exports = Header
