module.exports = function(file) {
    return new Promise(function(resolve, reject) {
        file.upload({
            dirname: sails.getUploadDirFromTmp,
        }, function(err, files) {
            if(err) return reject(err);

            for(var i=0; i<files.length; i++) {
                var filename = getFilename(files[i].fd);
                files[i].extra = {
                    uploadDir: sails.getUploadDir,
                    filename: filename,
                    uploadFilepath: sails.getUploadDir + filename,
                };
            }

            return resolve(files);
        });
    });
};
