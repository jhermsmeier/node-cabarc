var Cabinet = module.exports

/**
 * Cabinet file signature
 * ('MSCF', 4D 53 43 46)
 * @type {Number}
 */
Cabinet.MAGIC = 0x4643534D

Cabinet.COMPRESSION = {
  NONE: 0x0000,
  MSZIP: 0x0001, // ???
}

Cabinet.Header = require( './header' )
Cabinet.Folder = require( './folder' )
Cabinet.File = require( './file' )
Cabinet.DataBlock = require( './data-block' )
Cabinet.Archive = require( './archive' )
