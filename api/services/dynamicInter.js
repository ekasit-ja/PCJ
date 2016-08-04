module.exports = function(req, model, items) {
    if(req.getLocale() == "th") {
        if(Array.isArray(items)) {
            for(var i=0; i<items.length; i++) {
                if(model == "Type" || model == "Product")
                    items[i].title = items[i].title_th || items[i].title;

                if(model == "Model" || model == "File" || model == "Hardware" || model == "Project") {
                    items[i].title = items[i].title_th || items[i].title;
                    items[i].desc = items[i].desc_th || items[i].desc;
                }
            }
        }
        else {
            if(model == "Type" || model == "Product")
                items.title = items.title_th || items.title;

            if(model == "Model" || model == "File" || model == "Hardware" || model == "Project") {
                items.title = items.title_th || items.title;
                items.desc = items.desc_th || items.desc;
            }
        }
    }
}
