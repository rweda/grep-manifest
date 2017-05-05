const glob = require("glob-promise");

/**
 * Options to configure the operation of {@link ManifestSearch}
 * @typedef {Object} ManifestSearchOptions
 * @property {Object} glob [Options]{@link https://github.com/isaacs/node-glob#options} to pass to the
 *   [glob]{@link https://github.com/isaacs/node-glob} library.
 * @property {String} glob.cwd The current working directory in which to search. Defaults to `process.cwd()`.
 * @property {Array<String>} glob.ignore Add a pattern or an array of glob patterns to exclude matches.
 *   Set to `["**\/node_modules/**\/*"]` by default.
 * @property {String} query The query to pass to Glob.  If not explicitly provided, a default query will be built
 *   according to other options.
 * @property {Boolean} deep Sets the default `query`.  If `true`, searches directories recursively for manifest files.
 *   If `false`, only one layer of directories is searched.  Defaults to `false`.
 * @property {Array<String>} manifestFiles The filenames for manifest files to search for.  `"*"` is allowed according
 *   to the Glob library.  Defaults to `["package.json"]`.
 * @property {Array<SearchResult>} include Specific search results to include in the output.  Useful to add a single
 *   file in a larger directory excluded by `glob.ignore`.
*/

/**
 * The path to a found manifest.
 * @typedef {!String} SearchResult
*/

/**
 * All results from a package search.
 * @typedef {!Array<SearchResult>} SearchResults
*/

/**
 * Searches for Manifest files (`package.json`)
*/
class ManifestSearch {

  /**
   * @param {ManifestSearchOptions} [opts] Options to configure searching.
  */
  constructor(opts) {
    /**
     * The current options used for searching.
     * @type {ManifestSearchOptions}
    */
    this.opts = opts || {};
    if(!this.opts.glob) { this.opts.glob = {}; }
    if(!this.opts.glob.ignore) { this.opts.glob.ignore = ["**/node_modules/**/*"]; }
    if(!this.opts.include) { this.opts.include = []; }
    /**
     * The last search executed, cached for preformance.
     * @type {Promise<SearchResults>}
     * @private
    */
    this._lastSearch = null;
  }

  /**
   * Exclude a specific Glob pattern from being searched.
   * @param {String} pattern the Glob pattern to add.
   * @return {ManifestSearch} for chaining.
  */
  exclude(pattern) {
    this.opts.glob.ignore.push(pattern);
    return this;
  }

  /**
   * Add a search result to explicitly be included in the output.
   * @param {SearchResult} result the result to include in output.
   * @return {ManifestSearch} for chaining.
  */
  include(result) {
    this.opts.include.push(result);
    return this;
  }

  /**
   * Start a search for manifests.
   * @param {Boolean} cache if `true`, returns the last search (if available) instead of searching again.
   * @return {Promise<SearchResults>}
  */
  search(cache) {
    if(cache && this._lastSearch) { return this._lastSearch; }
    let manifestFiles = "@(" + (this.opts.manifestFiles || ["package.json"]).join(",") + ")";
    let query = this.opts.query || ((this.opts.deep || false) ? "**/" + manifestFiles : "*/" + manifestFiles);
    return glob
      .promise(query, this.opts.glob)
      .then( (contents) => contents.concat(this.opts.include) );
  }

}

module.exports = ManifestSearch;
