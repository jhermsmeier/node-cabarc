/**
 * Cabinet File (struct CFFILE)
 * @constructor
 * @memberOf Cabinet
 * @returns {CFFile}
 */
function CFFile() {

  if( !(this instanceof CFFile) )
    return new CFFile()

  /** @type {Number} Uncompressed size of this file in bytes */
  this.size = 0x00000000
  /** @type {Number} Uncompressed offset of this file in the folder */
  this.folderOffset = 0x00000000
  /** @type {Number} Index into the `CFFOLDER` area */
  this.folderIndex = 0x0000
  /** @type {Number} Date stamp for this file */
  this.date = 0x0000
  /** @type {Number} Time stamp for this file */
  this.time = 0x0000
  /** @type {Number} Attribute flags for this file */
  this.flags = 0x0000
  /** @type {String} Name of this file */
  this.name = ''

}

// File is read-only
CFFile.RDONLY = 0x01
// File is hidden
CFFile.HIDDEN = 0x02
// File is a system file
CFFile.SYSTEM = 0x04
// File modified since last backup
CFFile.ARCH = 0x20
// Run after extraction
CFFile.EXEC = 0x40
// szName[] contains UTF
CFFile.UNICODE = 0x80

// Folder index flags
CFFile.INDEX_CONTINUED_FROM_PREV = 0xFFFD
CFFile.INDEX_CONTINUED_TO_NEXT = 0xFFFE
CFFile.INDEX_CONTINUED_PREV_AND_NEXT = 0xFFFF

/**
 * File structure base size in bytes
 * NOTE: This doesn't include the dynamically
 * sized `name` field's bytes
 * @type {Number}
 */
CFFile.SIZE = 16

// Assuming the same 255 + NUL byte limit as for paths in Cabinet.Header
CFFile.MAX_SIZE = CFFile.SIZE + 255 + 1

/**
 * Parse a Cabinet File from a buffer
 * @param {Buffer} buffer
 * @param {Number} [offset=0]
 * @returns {CFFile}
 */
CFFile.parse = function( buffer, offset ) {
  return new CFFile().parse( buffer, offset )
}

/**
 * File prototype
 * @type {Object}
 * @ignore
 */
CFFile.prototype = {

  constructor: CFFile,

  get readOnly() { return this.getFlag( CFFile.RDONLY ) },
  set readOnly( value ) { this.setFlag( CFFile.RDONLY, value ) },

  get hidden() { return this.getFlag( CFFile.HIDDEN ) },
  set hidden( value ) { this.setFlag( CFFile.HIDDEN, value ) },

  get system() { return this.getFlag( CFFile.SYSTEM ) },
  set system( value ) { this.setFlag( CFFile.SYSTEM, value ) },

  get arch() { return this.getFlag( CFFile.ARCH ) },
  set arch( value ) { this.setFlag( CFFile.ARCH, value ) },

  get exec() { return this.getFlag( CFFile.EXEC ) },
  set exec( value ) { this.setFlag( CFFile.EXEC, value ) },

  get utfName() { return this.getFlag( CFFile.UNICODE ) },
  set utfName( value ) { this.setFlag( CFFile.UNICODE, value ) },

  getFlag( mask ) {
    return this.flags & mask == mask
  },

  setFlag( mask, value ) {
    if( !value && ( this.flags & mask == mask ) )
      this.flags = this.flags ^ mask
    if( value && ( this.flags & mask != mask ) )
      this.flags = this.flags | mask
    return this.flags
  },

  encodingLength() {
    return CFFile.SIZE + Buffer.byteLength( this.name ) + 1
  },

  /**
   * Parse a Cabinet File from a buffer
   * @param {Buffer} buffer
   * @param {Number} [offset=0]
   * @returns {CFFile}
   */
  parse( buffer, offset ) {

    offset = offset || 0

    this.size = buffer.readUInt32LE( offset + 0 )
    this.folderOffset = buffer.readUInt32LE( offset + 4 )
    this.folderIndex = buffer.readUInt16LE( offset + 8 )

    var date = buffer.readUInt16LE( offset + 10 )

    this.date = {
      day: date & 0x1F,
      month: ( date >>> 5 ) & 0x0F,
      year: ( date >>> 9 ) + 1980,
    }

    var time = buffer.readUInt16LE( offset + 12 )

    this.time = {
      hour: ( time >>> 11 ),
      minute: ( time >>> 5 ) & 0x3F,
      second: ( time & 0x1F ) * 2,
    }

    this.flags = buffer.readUInt16LE( offset + 14 )

    var eos = buffer.indexOf( 0x00, offset + 16 )
    eos = eos === -1 ? buffer.length : eos

    this.name = buffer.toString( 'utf8', offset + 16, eos )

    return this

  },

  /**
   * Write the Cabinet File to a buffer
   * @param {Buffer} [buffer]
   * @param {Number} [offset=0]
   * @return {Buffer}
   */
  write( buffer, offset ) {

    buffer = buffer || Buffer.alloc( CFFile.SIZE )
    offset = offset || 0

    throw new Error( 'Not implemented' )

    var date = ( ( year - 1980 ) << 9 ) + ( month << 5 ) + ( day )
    var time = ( hour << 11 ) + ( minute << 5 ) + ( seconds / 2 )

    return buffer

  }

}

module.exports = CFFile
