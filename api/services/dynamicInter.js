module.exports = function(req, model, items) {
    if(req.getLocale() == "th") {
        if(Array.isArray(items)) {
            for(var i=0; i<items.length; i++) {
                if(model == "Type" || model == "Product") {
                    items[i].title = items[i].title_th || items[i].title;
                }
                else if(model == "Model" || model == "Project") {
                    items[i].title = items[i].title_th || items[i].title;
                    items[i].desc = items[i].desc_th || items[i].desc;
                }
                else if(model == "File") {
                    items[i].title = items[i].title_th || items[i].title;
                    items[i].desc = items[i].desc_th || items[i].desc;
                    items[i].url = items[i].url_th || items[i].url;
                }
                else if(model == "Hardware") {
                    items[i].title = items[i].title_th || items[i].title;
                    items[i].desc = items[i].desc_th || items[i].desc;
                    items[i].image = items[i].image_th || items[i].image;
                }
                else if(model == "News") {
                    items[i].title = items[i].title_th || items[i].title;
                    items[i].content = items[i].content_th || items[i].content;
                    items[i].content_code = items[i].content_code_th || items[i].content_code;
                }
                else if(model == "SupplierBalance") {
                    items[i].title_1 = items[i].title_1_th || items[i].title_1;
                }
            }
        }
        else if(typeof items != "undefined" && items != null) {
            if(model == "Type" || model == "Product") {
                items.title = items.title_th || items.title;
            }
            else if(model == "Model" || model == "Project") {
                items.title = items.title_th || items.title;
                items.desc = items.desc_th || items.desc;
            }
            else if(model == "File") {
                items.title = items.title_th || items.title;
                items.desc = items.desc_th || items.desc;
                items.url = items.url_th || items.url;
            }
            else if(model == "Hardware") {
                items.title = items.title_th || items.title;
                items.desc = items.desc_th || items.desc;
                items.image = items.image_th || items.image;
            }
            else if(model == "News") {
                items.title = items.title_th || items.title;
                items.content = items.content_th || items.content;
                items.content_code = items.content_code_th || items.content_code;
            }
            else if(model == "SupplierBalance") {
                items.title_1 = items.title_1_th || items.title_1;
            }
        }
    }
}
