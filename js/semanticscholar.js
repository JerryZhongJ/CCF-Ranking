/**
 * MIT License
 *
 * Copyright (c) 2019-2023 WenyanLiu (https://github.com/WenyanLiu/CCFrank4dblp)
 */

const semanticscholar = {};

semanticscholar.rankSpanList = [];

semanticscholar.run = function () {
    let url = window.location.pathname;
    setInterval(function () {
        $(window).bind("popstate", function () {
            semanticscholar.appendRanks();
        });
        semanticscholar.appendRanks();
    }, 700);
};

semanticscholar.appendRanks = function () {
    let elements = $(".cl-paper-row");
    elements.each(function () {
        let element = $(this);
        let titleElement = $(".cl-paper-title", element).contents().last()
     
        if (titleElement.hasClass("ccf-rank")) {
            return
        }
        let title = titleElement.text();
        let author = $(".cl-paper-authors__author-link", element).first().text();

        showRank_dblp(titleElement, title, author)        
    });
};


 