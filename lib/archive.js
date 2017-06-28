var Cabinet = require( './cabinet' )
var fs = require( 'fs' )

/**
 * Archive
 * @constructor
 * @memberOf Cabinet
 * @returns {Archive}
 */
function Archive() {

  if( !(this instanceof Archive) )
    return new Archive()

  this.header = new Cabinet.Header()

  this.fd = null
  this.path = null
  this.flags = 'r'
  this.mode = 0o666

}

/**
 * Archive prototype
 * @type {Object}
 * @ignore
 */
Archive.prototype = {

  constructor: Archive,

  readHeader( callback ) {

    var buffer = Buffer.alloc( 64 * 1024 )
    var offset = 0
    var length = 64 * 1024
    var position = 0

    fs.read( this.fd, buffer, offset, length, position, ( error, bytesRead, buffer ) => {
      this.header.parse( buffer )
      callback( error, this.header )
    })

  },

  readFolders() {

    var count = this.header.folderCount

    fs.read

  },

  open( filename, callback ) {

    if( this.fd != null ) {
      this.close( ( error ) => {
        if( error ) return callback.call( this, error )
        this.open( filename, callback )
      })
    }

    var tasks = [
      ( next ) => {
        fs.open( filename, this.flags, this.mode, ( error, fd ) => {
          this.fd = fd
          this.path = filename
          next( error, fd )
        })
      },
      ( next ) => this.readHeader( next ),
    ]

    var run = ( error ) => {
      if( error ) return callback.call( this, error )
      var task = tasks.shift()
      task ? task( run ) : callback.call( this )
    }

    run()

    return this

  },

  close( callback ) {

    if( this.fd == null ) {
      return callback.call( this )
    }

    fs.close( this.fd, ( error ) => {
      callback.call( this, error )
    })

    this.fd = null

  },

  createReadStream( filename, options ) {
    throw new Error( 'Not implemented' )
  },

}

module.exports = Archive
