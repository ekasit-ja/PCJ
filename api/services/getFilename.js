module.exports = function(filepath) {
    filepath = filepath.replace(/\\/g, "/");
    return filepath.split("/").reverse()[0];
}
