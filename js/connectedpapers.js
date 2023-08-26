/**
 * MIT License
 *
 * Copyright (c) 2019-2023 WenyanLiu (https://github.com/WenyanLiu/CCFrank4dblp), purplewall1206 (https://github.com/purplewall1206)
 */

const connectedpapers = {};

connectedpapers.rankSpanList = [];

connectedpapers.run = function () {
    let url = window.location.pathname;
    window.onload = function () {
        setTimeout(function () {
            if (url.indexOf('/main') != -1) {
                connectedpapers.appendRanks();
            }
        }, 3000);
    };
};



connectedpapers.appendRanks = function () {
    let elements = $(".list-group-item-mod");
    elements.each(function () {
        let texts = $(this).find(".searchable-text");
        let author
        let title
        texts.each(function () {
            let text = $(this)
            if (text.hasClass('authors'))
                author = text.text().split(/[\s.,]+/)[1]
            else
                title = text.text()
        })
        let titlenode = $(this).find("h5")
        showRank_dblp(titlenode, title, author)
    });
};