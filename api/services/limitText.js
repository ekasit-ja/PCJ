module.exports = function(items) {
    // trim text if it is too long
    for(var i=0; i<items.length; i++) {
        var item = items[i];

        var headerLength = 100;
        var contentLength = 220;

        // remove html code to get pure text
        item.title = item.title.replace(/<[^>]*>/g, "");
        item.content = item.content.replace(/<[^>]*>/g, "");

        // trim and append ellipsis if too long
        if(item.title.length > headerLength) {
            item.title = item.title.substr(0, headerLength-2);
            item.title += "\u2026";
        }

        if(item.content.length > contentLength) {
            item.content = item.content.substr(0, contentLength-2);
            item.content += "\u2026";
        }
    }
}
