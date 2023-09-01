/**
 * MIT License
 *
 * Copyright (c) 2019-2023 WenyanLiu (https://github.com/WenyanLiu/CCFrank4dblp)
 */

parsers["semantic scholar"] =  () => {
    waitForElm(".result-page")
        .then(() => {
            let elements = $(".cl-paper-row");
            elements.each(function () {
                let element = $(this);
                let titleElement = $(".cl-paper-title", element).contents().last()
                let title = titleElement.text();
                let author = $(".cl-paper-authors__author-link", element).first().text();

                showRank_dblp(titleElement, title, author)
            })
        })
}
    



 