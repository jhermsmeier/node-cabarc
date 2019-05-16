var Cabinet = require( './cabinet' )
var fs = require( 'fs' )
var path = require( 'path' )
var os = require( 'os' )
var zlib = require( 'zlib' )

/**
 * Archive
 * @constructor
 * @memberOf Cabinet
 * @returns {Archive}
 */
function Archive() {

  if( !(this instanceof Archive) )
    return new Archive()

  this.fd = null
  this.path = null
  this.flags = 'r'
  this.mode = 0o666

  this.header = new Cabinet.Header()

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
          files.push( file )
        }
      } catch( e ) {
        error = e
      }
      this.files = files
      callback.call( this, error, this.files )
    })

  },

  readBlockHeader( folder, callback ) {

    var length = Cabinet.BlockHeader.size + this.header.blockData
    var offset = 0
    var buffer = Buffer.alloc( length )
    var position = folder.dataOffset

    fs.read( this.fd, buffer, offset, length, position, ( error, bytesRead, buffer ) => {

      if( error ) {
        return void callback.call( this, error )
      }

      var blockHeader = null
      try {
        blockHeader = Cabinet.BlockHeader.parse( buffer )
      } catch( e ) {
        error = e
      }

      callback.call( this, error, blockHeader )

    })

  },

  readFile( filename, callback ) {

    // NOTE: To maintain compatibility between operating systems,
    // we normalize the path to Windows path conventions, as the
    // Cabinet Archive format originated there
    filename = path.win32.normalize( filename )

    var file = null
    var folder = null

    for( var i = 0; i < this.files.length; i++ ) {
      if( this.files[i].name === filename ) {
        file = this.files[i]
        folder = this.folders[ file.folderIndex ]
        break
      }
    }

    if( file == null || folder == null ) {
      var error = new Error( 'ENOENT: no such file or directory' )
      error.code = 'ENOENT'
      error.errno = os.constants.errno.ENOENT
      error.path = filename
      return void callback.call( this, error )
    }

    if( ( folder.compressionType & Cabinet.COMPRESSION.LZX ) === Cabinet.COMPRESSION.LZX ) {
      var error = new Error( `Unsupported compression method "${folder.compressionType & 0xFF}"` )
      return void callback.call( this, error )
    }

    var length = file.size
    var offset = 0
    var buffer = Buffer.alloc( length )
    var position = folder.dataOffset + file.offset +
      Cabinet.BlockHeader.size + this.header.blockData

    fs.read( this.fd, buffer, offset, length, position, ( error, bytesRead, buffer ) => {

      if( folder.compressionType === Cabinet.COMPRESSION.MSZIP ) {
        var signature = buffer.readUInt16LE( 0 )
        if( signature !== Cabinet.MSZIP_SIGNATURE ) {
          return void callback.call( this, new Error( `Invalid MSZIP signature: 0x${signature.toString(16)}` ) )
        }
        console.log( buffer )
        buffer = zlib.inflateRawSync( buffer.slice( 2 ) )
      }

      callback.call( this, error, buffer )

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
