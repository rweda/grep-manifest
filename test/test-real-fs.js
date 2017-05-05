const chai = require("chai");
const should = chai.should();
const ManifestSearch = require("../ManifestSearch");
const path = require("path");
const tmp = require("tmp-promise");
const fs = require("fs-extra");

describe("Manifest Searching (Real FS)", function() {

  let dir = null;
  let dirNames = ["a", "b", "c"];

  beforeEach(function() {
    return tmp.dir({ unsafeCleanup: true }).then(o => dir = o)
      .then(() => Promise.all(dirNames.map(name =>
          fs.ensureDir(`${dir.path}/${name}`)
      )))
      .then(() => Promise.all(dirNames.map(name =>
        fs.writeJson(`${dir.path}/${name}/package.json`, { name: name, version: "0.0.0" })
      )));
  });

  afterEach(function() {
    return dir.cleanup();
  });

  it("should find 'package.json' inside 'manifest-search'", function() {
    let search = new ManifestSearch({ glob: { cwd: dir.path } });
    return search.search()
      .then(packages => {
        packages.length.should.equal(dirNames.length);
      });
  });

});
