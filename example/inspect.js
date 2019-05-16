var argv = process.argv.slice( 2 )
var path = require( 'path' )
var inspect = require( '../test/inspect' )
var Cabinet = require( '..' )

var filename = argv.shift()
if( !filename ) {
  console.error( 'Usage: node example/inspect <filename>' )
  process.exit( 1 )
}

var cab = new Cabinet.Archive()

cab.open( filename, ( error ) => {
  console.log( path.basename( filename ), inspect( error || cab ), '\n' )
})
