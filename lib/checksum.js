/**
 * Calculate the checksum of a given buffer
 * @memberOf Cabinet
 * @param {Buffer} buffer
 * @param {Number} [seed=0]
 * @return {Number} checksum
 */
function checksum( buffer, seed ) {

  var csum = seed || 0
  // Number of uint32s in the buffer
  var words = Math.floor( buffer.length / 4 )
  var offset = 0
  var value = 0

  // Checksum integral multiples of UInt32s
  while( words-- > 0 ) {
    value = buffer[ offset + 0 ]
    value |= buffer[ offset + 1 ] << 8
    value |= buffer[ offset + 2 ] << 16
    value |= buffer[ offset + 3 ] << 24
    csum ^= value
    offset += 4
  }

  value = 0

  // NOTE: The case fall-through here is intentional
  switch( buffer.length % 4 ) {
    case 3: value |= buffer[ offset++ ] << 16
    case 2: value |= buffer[ offset++ ] << 8
    case 1: value |= buffer[ offset++ ]
    default: break
  }

  csum ^= value

  return csum

}

module.exports = checksum
