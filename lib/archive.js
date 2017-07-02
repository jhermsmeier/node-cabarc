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
      callback.call( this, error, this.header )
    })

  },

  lsFolders( callback ) {

    var folderSize = Cabinet.Folder.size + this.header.folderData
    var count = this.header.folderCount
    var buffer = Buffer.alloc( folderSize * count )
    var offset = 0
    var length = folderSize
    var position = Cabinet.Header.size + this.header.headerData

    fs.read( this.fd, buffer, offset, length, position, ( error, bytesRead, buffer ) => {
      if( error ) return void callback.call( this, error )
      var folders = []
      try {
        while( offset < buffer.length ) {
          folders.push( Cabinet.Folder.parse( buffer, offset ) )
          offset += folderSize
        }
      } catch( e ) {
        error = e
      }
      this.folders = folders
      callback.call( this, error, this.folders )
    })

  },

  lsFiles( callback ) {

    var fileListOffset =
      ( Cabinet.Header.size + this.header.headerData ) +
      (( Cabinet.Folder.size + this.header.folderData ) * this.header.folderCount )

    var fileCount = this.header.fileCount
    var fileListSize = this.folders[0].dataOffset - fileListOffset
    var buffer = Buffer.alloc( fileListSize )
    var offset = 0
    var length = fileListSize
    var position = fileListOffset

    fs.read( this.fd, buffer, offset, length, position, ( error, bytesRead, buffer ) => {
      if( error ) return void callback.call( this, error )
      var files = []
      var file = null
      try {
        while( offset < buffer.length ) {
          file = Cabinet.File.parse( buffer, offset )
          offset += Cabinet.File.size + file.nameLength - 1
          console.log( file )
          files.push( file )
        }
      } catch( e ) {
        error = e
      }
      this.files = files
      callback.call( this, error, this.files )
    })

  },

  // TODO: Don't read structures on open(),
  // to facilitate creating archives from scratch
  // Create & use .ls() to read folders & files
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
      ( next ) => this.lsFolders( next ),
      ( next ) => this.lsFiles( next ),
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
