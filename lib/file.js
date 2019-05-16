/**
 * Cabinet File (struct CFFILE)
 * @constructor
 * @memberOf Cabinet
 * @returns {File}
 */
function File() {

  if( !(this instanceof File) )
    return new File()

  /** @type {Number} Uncompressed size of this file in bytes */
  this.size = 0x00000000
  /** @type {Number} Uncompressed offset of this file in the folder */
  this.offset = 0x00000000
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
File.RDONLY = 0x01
// File is hidden
File.HIDDEN = 0x02
// File is a system file
File.SYSTEM = 0x04
// File modified since last backup
File.ARCH = 0x20
// Run after extraction
File.EXEC = 0x40
// szName[] contains UTF
File.UNICODE = 0x80

/**
 * File structure base size in bytes
 * NOTE: This doesn't include the dynamically
 * sized `name` field's bytes
 * @type {Number}
 */
File.size = 18

/**
 * Parse a Cabinet File from a buffer
 * @param {Buffer} buffer
 * @param {Number} [offset=0]
 * @returns {File}
 */
File.parse = function( buffer, offset ) {
  return new File().parse( buffer, offset )
}

/**
 * File prototype
 * @type {Object}
 * @ignore
 */
File.prototype = {

  constructor: File,

  get readOnly() { return this.getFlag( File.RDONLY ) },
  set readOnly( value ) { this.setFlag( File.RDONLY, value ) },

  get hidden() { return this.getFlag( File.HIDDEN ) },
  set hidden( value ) { this.setFlag( File.HIDDEN, value ) },

  get system() { return this.getFlag( File.SYSTEM ) },
  set system( value ) { this.setFlag( File.SYSTEM, value ) },

  get arch() { return this.getFlag( File.ARCH ) },
  set arch( value ) { this.setFlag( File.ARCH, value ) },

  get exec() { return this.getFlag( File.EXEC ) },
  set exec( value ) { this.setFlag( File.EXEC, value ) },

  get utfName() { return this.getFlag( File.UNICODE ) },
  set utfName( value ) { this.setFlag( File.UNICODE, value ) },

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

  /**
   * Parse a Cabinet File from a buffer
   * @param {Buffer} buffer
   * @param {Number} [offset=0]
   * @returns {File}
   */
  parse( buffer, offset ) {

    offset = offset || 0

    this.size = buffer.readUInt32LE( offset + 0 )
    this.offset = buffer.readUInt32LE( offset + 4 )
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

    buffer = buffer || Buffer.alloc( File.size )
    offset = offset || 0

    throw new Error( 'Not implemented' )

    var date = ( ( year - 1980 ) << 9 ) + ( month << 5 ) + ( day )
    var time = ( hour << 11 ) + ( minute << 5 ) + ( seconds / 2 )

    return buffer

  }

}

module.exports = File
