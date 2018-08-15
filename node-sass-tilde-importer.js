const path = require('path');
const findParentDir = require('find-parent-dir');
const fs = require('fs');

function resolve(targetUrl, source) {
  let packageRoot = findParentDir.sync(source, 'node_modules');

  if (!packageRoot) {
    return null;
  }

  const filePath = path.resolve(packageRoot, 'node_modules', targetUrl);
  const isPotentiallyDirectory = !path.extname(filePath);

  if (fs.existsSync(path.dirname(filePath))) {
    return filePath;
  } else if (isPotentiallyDirectory && fs.existsSync(filePath)) {
    return path.resolve(filePath, 'index');
  }

  return resolve(targetUrl, path.dirname(packageRoot));
}

module.exports = function importer (url, prev, done) {
  return (url[ 0 ] === '~') ? { file: resolve(url.substr(1), prev) } : null;
};
