/**
 * MIT License
 *
 * Copyright (c) 2019-2023 WenyanLiu (https://github.com/WenyanLiu/CCFrank4dblp)
 */


parsers["google scholar/scholar"] = function () {
    let elements = $("#gs_res_ccl_mid > div > div.gs_ri");
    elements.each(function () {
        let node = $(this).find("h3 > a");
        
        let title = node.text();
        let data = $(this)
            .find("div.gs_a")
            .text()
            .replace(/[\,\-\…]/g, "")
            .split(" ");
        let author = data[1];
        let year = data.slice(-3)[0];
        showRank_dblp(node, title, author)
        
    });
};

parsers["google scholar/citations"] = function () {
    onChildListAdded("#gsc_a_b", nodes => {
        
        nodes.each(function () {
            let node = $(this).find("td.gsc_a_t > a").first();
            
            let title = node.text();
            let author = $(this)
                .find("div.gs_gray")
                .text()
                .replace(/[\,\…]/g, "")
                .split(" ")[1];
            showRank_dblp(node, title, author)
        
        });
    });
};
