var Cabinet = module.exports

/**
 * Cabinet file signature
 * ('MSCF', 4D 53 43 46)
 * @type {Number}
 */
Cabinet.SIGNATURE = 0x4643534D

Cabinet.MSZIP_SIGNATURE = 0x4B43

Cabinet.COMPRESSION = {
  NONE: 0x0000,
  MSZIP: 0x0001,
  LZX: 0x0003,
  // NOTE: High 8 bits store compression extra
  // (for LZX the value between 15-21 [0x0F-0x15])
  // LZX21: 0x1503,
  // LZX15: 0x0F03,
}

Cabinet.checksum = require( './checksum' )

Cabinet.Header = require( './header' )
Cabinet.Folder = require( './folder' )
Cabinet.File = require( './file' )
Cabinet.BlockHeader = require( './block-header' )
Cabinet.Archive = require( './archive' )
