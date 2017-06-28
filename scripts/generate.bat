@echo off

rem COMPRESSION TESTS
rem Generate an archive for each compression method; LZX:<15..21>, MSZIP, NONE
rem NOTE: We set the `set ID` of the cab archives to `12345` to verify it in the tests

rem Compression method: NONE
cabarc -m NONE -i 12345 -r -p -P test\data\source\ n test\data\compression\none.cab test\data\source\*
rem Compression method: MSZIP
cabarc -m MSZIP -i 12345 -r -p -P test\data\source\ n test\data\compression\mszip.cab test\data\source\*
rem Compression method: LZX:15
cabarc -m LZX:15 -i 12345 -r -p -P test\data\source\ n test\data\compression\lzx-15.cab test\data\source\*
rem Compression method: LZX:21
cabarc -m LZX:21 -i 12345 -r -p -P test\data\source\ n test\data\compression\lzx-21.cab test\data\source\*
