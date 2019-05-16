var argv = process.argv.slice( 2 )
var path = require( 'path' )
var inspect = require( '../test/inspect' )
var Cabinet = require( '..' )

var archiveFilename = argv.shift()
var filename = argv.shift()

if( !archiveFilename || !filename ) {
  console.error( 'Usage: node example/read-file <archive> <filename>' )
  process.exit( 1 )
}

var cab = new Cabinet.Archive()

cab.open( archiveFilename, ( error ) => {
  console.log( path.basename( archiveFilename ), inspect( error || cab ), '\n' )
  cab.readFile( filename, ( error, file ) => {
    console.log( filename, inspect( error || file ), '\n' )
    console.log( file.toString() )
  })
})
