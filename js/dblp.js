/**
 * MIT License
 *
 * Copyright (c) 2019-2023 WenyanLiu (https://github.com/WenyanLiu/CCFrank4dblp), FlyingFog (https://github.com/FlyingFog)
 */


parsers["dblp/pid"] = function () {
    onChildListAdded("ul.publ-list", nodes => {
        elements = nodes.find("cite > a")
        elements.each(function () {
            let element = $(this);
            let source = element.attr("href");
            if (source.length != 0) {
                let url = source.substring(
                    source.indexOf("/db/") + 3,
                    source.lastIndexOf("/")
                );

                showRank_url(element, url)
            
            }
        });
    })
    
};

parsers["dblp/db_index"] = (() => dblp_appendRank("h1"))
parsers["dblp/db_no_index"] = (() => dblp_appendRank("#breadcrumbs > ul > li > span:nth-child(3) > a > span"))
parsers["dblp/search"] = parsers["dblp/pid"]


function dblp_appendRank(selector) {
    let element = $(selector);
    let headline = window.location.pathname;
    if (headline.length != 0) {
       
        let url = headline.substring(
            headline.indexOf("/db/") + 3,
            headline.lastIndexOf("/")
        );
        
        showRank_url(element, url)
        
    }
};
