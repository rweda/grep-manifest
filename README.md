# Manifest Search

[![npm](https://img.shields.io/npm/v/manifest-search.svg)](https://www.npmjs.com/package/manifest-search)
[![Travis CI](https://travis-ci.org/rweda/manifest-search.svg?branch=master)](https://travis-ci.org/rweda/manifest-search)

Finds packages by searching for manifest files.

## Installation

```sh
npm install manifest-search
```

## Usage

```js
const ManifestSearch = require("manifest-search");

let search = new ManifestSearch({
  deep: true,
});

search.search()
  .then(results => {
    for (result of results) {
      console.log(result);
    }
  });
```

See [ManifestSearchOptions][] for all options that can be passed to [ManifestSearch][].

[ManifestSearchOptions]: https://rweda.github.io/manifest-search/global.html#ManifestSearchOptions
[ManifestSearch]: https://rweda.github.io/manifest-search/ManifestSearch.html
