# cabarc
[![npm](https://img.shields.io/npm/v/cabarc.svg?style=flat-square)](https://npmjs.com/package/cabarc)
[![npm license](https://img.shields.io/npm/l/cabarc.svg?style=flat-square)](https://npmjs.com/package/cabarc)
[![npm downloads](https://img.shields.io/npm/dm/cabarc.svg?style=flat-square)](https://npmjs.com/package/cabarc)
[![build status](https://img.shields.io/travis/jhermsmeier/node-cabarc.svg?style=flat-square)](https://travis-ci.org/jhermsmeier/node-cabarc)

Microsoft Cabinet Archive Format

## Install via [npm](https://npmjs.com)

```sh
$ npm install --save cabarc
```

## Related Modules

- [wim](http://github.com/jhermsmeier/node-wim) – Windows Imaging File Format (WIM)
- [lzx](http://github.com/jhermsmeier/node-lzx) – LZX Compression Algorithm

## Usage

```js
var Cabinet = require( 'cabarc' )
```

```js
var cab = new Cabinet.Archive()

cab.open( 'path/to/filename.cab', function( error ) {
  if( error ) throw error
  console.log( cab.header )
})
```

## References

- [MSDN / Microsoft Cabinet Format](https://msdn.microsoft.com/en-us/library/bb417343.aspx?f=255&MSPPError=-2147217396)
- [Wikipeda / Cabinet File Format](https://en.wikipedia.org/wiki/Cabinet_(file_format))
