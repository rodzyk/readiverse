# Readiverse.js

**Readiverse.js** is a JavaScript library designed for reading and parsing multiple eBook and document formats, starting with `.mobi` and `.djvu`, with plans for future support of additional formats.

## Features

- 📖 **MOBI Reader**: Parse and extract content from `.mobi` files, including metadata, text, and images.
- 📚 **DJVU Reader**: Load and display `.djvu` documents. (WIP..)

## Installation

To install **Readiverse.js**, use npm:

```bash
npm install readiverse
```

## Usage
Here's a simple example of how to use Readiverse.js to load a .mobi file:

```ts
import { MobiFileReader } from "./mobi";
import * as fs from 'fs';

const FILE_NAME = `assets/sample1.mobi`;

const view = new DataView(fs.readFileSync(FILE_NAME, null).buffer)
const mobi = new MobiFileReader(view);

const td = new TextDecoder("utf-8");
const html = td.decode(mobi.readText())
```

## API
### MobiFileReader
`new MobiFileReader(file)`
Creates a new instance of the MobiFileReader with the provided file.

`readText()`
Parses the .mobi file and returns an object containing metadata, content, and images.

## Roadmap

- [x] MOBI file support
- [ ] DJVU file support

## Contributing
We welcome contributions! If you'd like to improve the library or add new features, feel free to submit a pull request or open an issue.

## License
This project is licensed under the MIT License.
