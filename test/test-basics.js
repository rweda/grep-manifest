const chai = require("chai");
const should = chai.should();
const mock = require("mock-fs");
const ManifestSearch = require("../ManifestSearch");

/**
 * Generate a random integer.
*/
function random(min, max) {
  if(!max && min) { max = min; min = 0; }
  if(!max) { max = 1000; }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function str(opts) {
  if(!opts) { opts = {}; }
  if(!opts.len) { opts.len = random(0, 30); }
  let chars = "";
  let alpha = "abcdefghijklmnopqrstuvwxyz";
  let numbs = "0123456789";
  if(opts.lower !== false) { chars += alpha.toLowerCase(); }
  if(opts.upper !== false) { chars += alpha.toUpperCase(); }
  if(opts.numeric !== false) { chars += numbs; }
  let out = "";
  for(let i = 0; i < opts.len; i++) {
    out += chars[random(chars.length - 1)];
  }
  return out;
}

function directory() { return str({numeric: false, len: random(5, 12)}); }

function manifest(opts) {
  if(!opts) { opts = {}; }
  return JSON.stringify({
    "name": opts.name || str({numeric: false, len: random(2, 8)}) + "-" + str({numeric: false, len: random(2, 8)}),
  });
}

function packageTree(opts) {
  if(!opts) { opts = {}; }
  let pkg = {};
  if(opts.manifest !== false) {
    pkg["package.json"] = opts.manifest || manifest();
  }
  if(opts.nodeModules !== false) {
    pkg["node_modules"] = {};
    let count = (typeof opts.nodeModules === "number") ? opts.nodeModules : random(0, 5);
    for(let i = 0; i<count; i++) {
      pkg["node_modules"][directory()] = packageTree({nodeModules: false});
    }
  }
  return pkg;
}

describe("Manifest Searching (Mocked)", function() {

  let tree = {};
  let root_packages = 0;
  let root_packages_submodules = false;
  let deep_packages = 0;
  let deep_packages_submodules = false;

  function createTree() {
    tree = {};
    for(let i = 0; i<root_packages; i++) {
      tree[directory()] = packageTree({nodeModules: root_packages_submodules});
    }
    for(let i = 0; i<deep_packages; i++) {
      let dir = directory();
      if(!tree[dir]) { tree[dir] = {}; }
      tree[dir][directory()] = packageTree({nodeModules: deep_packages_submodules});
    }
  }

  beforeEach(function() {
    root_packages = random(2, 5);
    deep_packages = random(0, 10);
    root_packages_submodules = false;
    deep_packages_submodules = false;
    createTree();
  });

  afterEach(function() {
    mock.restore();
  });

  it("should only find top-level packages by default", function() {
    mock(tree);
    let search = new ManifestSearch();
    return search.search()
      .then(packages => {
        packages.length.should.equal(root_packages);
      });
  });

  it("should find the deep of packages", function() {
    mock(tree);
    let search = new ManifestSearch({ deep: true });
    return search.search()
      .then(packages => {
        packages.length.should.equal(root_packages + deep_packages);
      });
  });

  describe("with subpackages", function() {

    beforeEach(function() {
      root_packages_submodules = true;
      deep_packages_submodules = true;
      createTree();
    });

    it("should not include packages in 'node_modules/'", function() {
      mock(tree);
      let search = new ManifestSearch({ deep: true });
      return search.search()
        .then(packages => {
          packages.length.should.equal(root_packages + deep_packages);
        });
    });

  });

});
