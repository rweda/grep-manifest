# Change Log

## Unreleased

## 0.1.1 - 2017-05-01

Bugfixes to searching.

### Added
- Tests running on an unmocked file system

### Modified
- Fixed `glob` searching - should use `@(package.json)` instead of `{package.json}`
- Marked tests inside `test-basics` as using `"Mocked"` filesystem
- Corrected `deep` usage
  - Fixed `deep` selector
  - Added `deep` option to tests that used deep searches

## 0.1.0 - 2017-05-01

Started `ManifestSearch`.  Setup testing and documentation.
