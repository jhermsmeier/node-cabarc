var bench = require( 'nanobench' )
var Cabinet = require( '..' )

var ITERATIONS = 1000000

bench( `Cabinet.checksum(1KB) ⨉ ${ITERATIONS}`, function( run ) {

  var buffer = require( 'crypto' ).randomBytes( 1024 )
  var checksum = -1

  run.start()

  for( var i = 0; i < ITERATIONS; i++ ) {
    checksum = Cabinet.checksum( buffer )
  }

  run.end()

})
