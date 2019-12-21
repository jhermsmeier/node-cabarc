var fs = require( 'fs' )
var path = require( 'path' )
var os = require( 'os' )
var Cabinet = require( './cabinet' )
var async = require( './async' )

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

  readFileList( callback ) {

    var length = Cabinet.File.MAX_SIZE
    var buffer = Buffer.alloc( length )
    var position = this.header.fileOffset
    var offset = 0

    var fileIndex = 0
    var files = []

    async.whilst(
      () => { return fileIndex < this.header.fileCount },
      ( next ) => {
        fs.read( this.fd, buffer, offset, length, position, ( error, bytesRead ) => {

          if( error ) {
            return void next( error )
          }

          try {
            var file = Cabinet.File.parse( buffer )
            files.push( file )
            fileIndex += 1
            position += file.encodingLength()
          } catch( e ) {
            return void next( e )
          }

          next()

        })
      },
      ( error ) => {
        this.files = files
        callback.call( this, error, files )
      }
    )

  },

  readFolder( folderIndex, callback ) {

    var length = Cabinet.Folder.SIZE + this.header.folderData
    var buffer = Buffer.alloc( length )
    var position = this.header.byteLength + ( folderIndex * length )
    var offset = 0

    fs.read( this.fd, buffer, offset, length, position, ( error, bytesRead, buffer ) => {

      if( error || bytesRead !== length ) {
        error = error || new Error( `Bytes read mismatch; expected ${length}, read ${bytesRead}` )
        return void callback.call( this, error )
      }

      var folder = null

      try {
        folder = Cabinet.Folder.parse( buffer )
      } catch( e ) {
        return void callback.call( this, e )
      }

      callback.call( this, null, folder )

    })

  },

  readFile( filename, callback ) {

    // NOTE: To maintain compatibility between operating systems,
    // we normalize the path to Windows path conventions, as the
    // Cabinet Archive format originated there
    filename = path.win32.normalize( filename )

    var file = this.files.find(( file ) => {
      return file.name === filename
    })

    // console.log( 'File:', file, '\n' )

    if( file == null ) {
      var error = new Error( 'ENOENT: no such file or directory' )
      error.code = 'ENOENT'
      error.errno = os.constants.errno.ENOENT
      error.path = filename
      return void callback.call( this, error )
    }

    this.readFolder( file.folderIndex, ( error, folder ) => {

      if( error ) {
        return void callback.call( this, error )
      }

      if( ( folder.compressionType & 0xFF00 ) !== Cabinet.COMPRESSION.NONE ) {
        return void callback.call( this, new Error( `Compression not supported` ) )
      }

      // console.log( 'Folder:', folder, '\n' )

      var length = Cabinet.Data.MAX_SIZE
      var blockBuffer = Buffer.allocUnsafe( length )
      var position = folder.dataOffset
      var blockIndex = 0

      var buffers = []

      async.whilst(
        () => { return blockIndex < folder.blockCount },
        ( next ) => {

          blockBuffer.fill( 0 )

          var offset = 0

          fs.read( this.fd, blockBuffer, offset, blockBuffer.length, position, ( error, bytesRead, blockBuffer ) => {

            if( error ) {
              return next( error )
            }

            var block = null

            try {
              block = new Cabinet.Data( this.header.blockData ).parse( blockBuffer )
            } catch( e ) {
              return void next( e )
            }

            position += Cabinet.Data.SIZE + this.header.blockData + block.compressedLength
            blockIndex += 1

            buffers.push( block.data )

            next()

          })

        },
        ( error ) => {
          // TODO: Decompress & write to fileBuffer while reading blocks,
          // instead of reading the entire folder into memory
          var buffer = Buffer.concat( buffers )
          var fileBuffer = Buffer.alloc( file.size )
          buffer.copy( fileBuffer, 0, file.folderOffset, file.folderOffset + file.size )
          callback.call( this, error, fileBuffer )
        }
      )

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
      ( next ) => this.readFileList( next ),
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
