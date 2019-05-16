# cabarc
[![npm](https://img.shields.io/npm/v/cabarc.svg?style=flat-square)](https://npmjs.com/package/cabarc)
[![npm license](https://img.shields.io/npm/l/cabarc.svg?style=flat-square)](https://npmjs.com/package/cabarc)
[![npm downloads](https://img.shields.io/npm/dm/cabarc.svg?style=flat-square)](https://npmjs.com/package/cabarc)
[![build status](https://img.shields.io/travis/jhermsmeier/node-cabarc/master.svg?style=flat-square)](https://travis-ci.org/jhermsmeier/node-cabarc)

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

### Opening a Cabinet archive

```js
var cab = new Cabinet.Archive()

cab.open( 'path/to/filename.cab', function( error ) {
  if( error ) throw error
  console.log( cab )
})
```

```js
Archive {
  header: Header {
    signature: 1178817357,
    reserved1: 0,
    archiveSize: 426,
    reserved2: 0,
    fileOffset: 44,
    reserved3: 0,
    versionMinor: 3,
    versionMajor: 1,
    folderCount: 1,
    fileCount: 2,
    flags: 0,
    setId: 12345,
    number: 0,
    headerData: 0,
    folderData: 0,
    blockData: 0,
    data: null,
    previous: null,
    previousDisk: null,
    next: null,
    nextDisk: null
  },
  fd: 13,
  path: '/Users/Jonas/Code/node-cabarc/test/data/compression/none.cab',
  flags: 'r',
  mode: 438,
  folders: [
    Folder {
      dataOffset: 110,
      blockCount: 1,
      compressionType: 0,
      appData: null
    }
  ],
  files: [
    File {
      size: 182,
      offset: 0,
      folderIndex: 0,
      date: 19164,
      time: 26424,
      flags: 0,
      name: 'README.md',
      attributes: 32,
      nameLength: 9
    },
    File {
      size: 126,
      offset: 182,
      folderIndex: 0,
      date: 19164,
      time: 26761,
      flags: 0,
      name: 'foldername\\somefile.txt',
      attributes: 32,
      nameLength: 23
    }
  ]
}
```

### Reading a file

```js
cab.readFile( 'foldername/somefile.txt', function( error, buffer ) {
  console.log( error ? error : buffer.toString() )
})
```

## References

- [MSDN / Microsoft Cabinet Format](https://msdn.microsoft.com/en-us/library/bb417343.aspx)
- [Wikipeda / Cabinet File Format](https://en.wikipedia.org/wiki/Cabinet_(file_format))
