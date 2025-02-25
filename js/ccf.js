/**
 * MIT License
 *
 * Copyright (c) 2019-2023 WenyanLiu (https://github.com/WenyanLiu/CCFrank4dblp), Kai Chen (https://github.com/FunClip)
 */

function putEmptyRankSpan(node) {
  return $("<span>").addClass("ccf-rank").text("CCF-?").insertAfter(node);
}

function setRankSpan(span, rank, abbr, fullname) {
  span.addClass(`ccf-${rank}`.toLowerCase()).text("CCF " + rank);
  span.addClass("ccf-tooltip").append(
    $("<pre>")
      .addClass("ccf-tooltiptext")
      .text(abbr + " - " + fullname)
  );
}

function _showRank(node, message) {
  if (node.next().hasClass("ccf-rank")) return;
  let span = putEmptyRankSpan(node);
  message["type"] = "get rank";
  chrome.runtime
    .sendMessage(message)
    .then(({ rank: rank, abbr: abbr, fullname: fullname }) =>
      setRankSpan(span, rank, abbr, fullname)
    );
}

function showRank_dblp(node, title, author) {
  _showRank(node, { by: "dblp", title: title, author: author });
}

function showRank_abbr(node, abbr) {
  _showRank(node, { by: "abbr", abbr: abbr });
}

function showRank_url(node, url) {
  _showRank(node, { by: "url", url: url });
}
