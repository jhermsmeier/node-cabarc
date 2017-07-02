/**
 * Cabinet File
 * @constructor
 * @memberOf Cabinet
 * @returns {File}
 */
function File() {

  if( !(this instanceof File) )
    return new File()

  this.size = 0x00000000
  this.offset = 0x00000000
  this.folderIndex = 0x0000
  this.date = 0x0000
  this.time = 0x0000
  this.flags = 0x0000
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
  set readOnly( value ) { return this.setFlag( File.RDONLY ) },

  get hidden() { return this.getFlag( File.HIDDEN ) },
  set hidden( value ) { return this.setFlag( File.HIDDEN ) },

  get system() { return this.getFlag( File.SYSTEM ) },
  set system( value ) { return this.setFlag( File.SYSTEM ) },

  get arch() { return this.getFlag( File.ARCH ) },
  set arch( value ) { return this.setFlag( File.ARCH ) },

  get exec() { return this.getFlag( File.EXEC ) },
  set exec( value ) { return this.setFlag( File.EXEC ) },

  get utfName() { return this.getFlag( File.UNICODE ) },
  set utfName( value ) { return this.setFlag( File.UNICODE ) },

  getFlag( mask ) {
    return this.flags & mask == mask
  },

  setFlag( mask, value ) {
    if( !value && (this.flags & mask == mask) )
      this.flags = this.flags ^ mask
    if( value && (this.flags & mask != mask) )
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
    this.date = buffer.readUInt16LE( offset + 10 )
    this.time = buffer.readUInt16LE( offset + 12 )
    this.attributes = buffer.readUInt16LE( offset + 14 )

    var nameEnd = buffer.indexOf( 0x00, offset + 16 )

    this.nameLength = nameEnd - ( offset + 16 )
    this.name = buffer.toString( 'utf8', offset + 16, nameEnd )

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

    // TODO

    return buffer

  }

}

module.exports = File
