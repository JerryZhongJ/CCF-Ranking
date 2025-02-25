/**
 * MIT License
 *
 * Copyright (c) 2019-2023 WenyanLiu (https://github.com/WenyanLiu/CCFrank4dblp)
 */

parsers["semantic scholar/search"] = async () => {
  parse_semantic_scholar_list(await waitForElm(".result-page"));
};

parsers["semantic scholar/paper"] = async () => {
  parse_semantic_scholar_list(await waitForElm(".citation-list__citations"));
};

function parse_semantic_scholar_list(list) {
  onChildListAdded(list, (elements) => {
    elements.each(async function () {
      let element = $(this);
      let titleElement = (await waitForElm(".cl-paper-title", element))
        .contents()
        .first();
      let title = titleElement.text();
      let author = (await waitForElm(".cl-paper-authors__author-box", element))
        .first()
        .text();

      showRank_dblp(titleElement, title, author);
    });
  });
}
