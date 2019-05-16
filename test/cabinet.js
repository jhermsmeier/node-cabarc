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

        before( 'constructor', function() {
          cab = new Cabinet.Archive()
        })

        before( `open('${basename}')`, function( done ) {
          cab.open( filename, function( error ) {
            // console.log( basename, inspect( error || cab ), '\n' )
            done( error )
          })
        })

        context( 'header', function() {

          specify( 'Signature', function() {
            assert.strictEqual( cab.header.signature, Cabinet.SIGNATURE, 'Invalid signature' )
            assert.strictEqual( cab.header.setId, 12345, 'Invalid set ID' )
            assert.ok( cab.header.fileCount > 0, 'No contained files' )
            assert.ok( cab.header.folderCount > 0, 'No contained folders' )
          })

          specify( 'Set-ID', function() {
            assert.strictEqual( cab.header.setId, 12345, 'Invalid set ID' )
          })

          specify( 'File & folder count', function() {
            assert.ok( cab.header.fileCount > 0, 'No contained files' )
            assert.ok( cab.header.folderCount > 0, 'No contained folders' )
          })

        })

        context( 'readFile()', function() {

          // NOTE: Skip compressed cab tests,
          // as compression methods aren't implemented yet
          var skip = !/(none).cab$/i.test( filename )

          specify( 'README.md', function( done ) {
            if( skip ) this.skip()
            var expected = fs.readFileSync( path.join( __dirname, 'data', 'source', 'README.md' ) )
            cab.readFile( 'README.md', function( error, buffer ) {
              assert.ifError( error )
              assert.ok( expected.equals( buffer ), 'Read data does not match' )
              done( error )
            })
          })

          specify( 'foldername/somefile.txt', function( done ) {
            if( skip ) this.skip()
            var expected = fs.readFileSync( path.join( __dirname, 'data', 'source', 'foldername/somefile.txt' ) )
            cab.readFile( 'foldername/somefile.txt', function( error, buffer ) {
              assert.ifError( error )
              assert.ok( expected.equals( buffer ), 'Read data does not match' )
              done( error )
            })
          })

        })

        after( 'close()', function( done ) {
          cab.close( done )
        })

      })

    })

  })

})
