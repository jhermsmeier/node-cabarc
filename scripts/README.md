# Scripts

## Generate

This script is used to generate test data cabinet archives.
As Windows doesn't necessarily ship `cabarc` or `makecab` utilities,
see https://stackoverflow.com/a/4168763 on how to get a hold of them

**Requirements:**

- Windows
- `cabarc` utility

**Cabarc command usage:**

```
> cabarc /?

Microsoft (R) Cabinet Tool - Version 5.1.2600.0
Copyright (c) Microsoft Corporation. All rights reserved..

Usage: CABARC [options] command cabfile [@list] [files] [dest_dir]

Commands:
   L   List contents of cabinet (e.g. cabarc l test.cab)
   N   Create new cabinet (e.g. cabarc n test.cab *.c app.mak *.h)
   X   Extract file(s) from cabinet (e.g. cabarc x test.cab foo*.c)

Options:
  -c   Confirm files to be operated on
  -o   When extracting, overwrite without asking for confirmation
  -m   Set compression type [LZX:<15..21>|MSZIP|NONE], (default is MSZIP)
  -p   Preserve path names (absolute paths not allowed)
  -P   Strip specified prefix from files when added
  -r   Recurse into subdirectories when adding files (see -p also)
  -s   Reserve space in cabinet for signing (e.g. -s 6144 reserves 6K bytes)
  -i   Set cabinet set ID when creating cabinets (default is 0)
  -d   Set diskette size (default is no limit/single CAB)

Notes
-----
When creating a cabinet, the plus sign (+) may be used as a filename
to force a folder boundary; e.g. cabarc n test.cab *.c test.h + *.bmp

When extracting files to disk, the <dest_dir>, if provided, must end in
a backslash; e.g. cabarc x test.cab bar*.cpp *.h d:\test\

The -P (strip prefix) option can be used to strip out path information
e.g. cabarc -r -p -P myproj\ a test.cab myproj\balloon\*.*
The -P option can be used multiple times to strip out multiple paths

When creating cabinet sets using -d, the cabinet name should contain
a single '*' character where the cabinet number will be inserted.
```
