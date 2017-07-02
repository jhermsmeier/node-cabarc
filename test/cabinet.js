var assert = require( 'assert' )
var fs = require( 'fs' )
var path = require( 'path' )
var Cabinet = require( '..' )
var inspect = require( './inspect' )

// console.log( 'Cabinet', inspect( Cabinet ), '\n' )

describe( 'Cabinet.Archive', function() {

  describe( 'Compression Methods', function() {

    fs.readdirSync( __dirname + '/data/compression' ).forEach( ( basename ) => {

      var filename = path.join( __dirname, 'data', 'compression', basename )

      context( `Compression: ${path.basename( filename, '.cab' ).toUpperCase()}`, function() {

        var cab = null

        specify( 'constructor', function() {
          cab = new Cabinet.Archive()
        })

        specify( `open('${basename}')`, function( done ) {
          cab.open( filename, function( error ) {
            // console.log( basename, inspect( error || cab ), '\n' )
            done( error )
          })
        })

        specify( 'header', function() {
          assert.strictEqual( cab.header.signature, Cabinet.SIGNATURE, 'Invalid signature' )
          assert.strictEqual( cab.header.setId, 12345, 'Invalid set ID' )
          assert.ok( cab.header.fileCount > 0, 'No contained files' )
          assert.ok( cab.header.folderCount > 0, 'No contained folders' )
        })

        specify( 'close()', function( done ) {
          cab.close( done )
        })

      })

    })

  })

})
