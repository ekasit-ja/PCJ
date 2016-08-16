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
                    uploadPath: sails.getUploadDir + filename,
                };
            }


            var fs = sails.fs;
            for(var i=0; i<files.length; i++) {
                var rd = fs.createReadStream(sails.prefixDir + files[i].extra.uploadPath);
                rd.on("error", function(err) {});

                var wr = fs.createWriteStream(".tmp/public/images/upload/" + files[i].extra.filename);
                wr.on("error", function(err) {});
                wr.on("close", function(ex) {});

                rd.pipe(wr);
            }

            return resolve(files);
        });
    });
};
