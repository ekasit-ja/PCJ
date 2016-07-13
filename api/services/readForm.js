module.exports = function(req, fields) {
    var data = {};
    for(field of fields)
        data[field] = req.param(field);

    return data;
}
