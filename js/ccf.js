/**
 * MIT License
 *
 * Copyright (c) 2019-2023 WenyanLiu (https://github.com/WenyanLiu/CCFrank4dblp), Kai Chen (https://github.com/FunClip)
 */




function putEmptyRankSpan(node) {
    return $("<span>").addClass("ccf-rank").insertAfter(node);
    
};

function setRankSpan(span, rank, abbr, fullname) {
    span.addClass(`ccf-${rank}`.toLowerCase())
        .text("CCF " + rank);
    span.addClass("ccf-tooltip")
        .append($("<pre>").addClass("ccf-tooltiptext").text(abbr + " - " + fullname));
}

function showRank_dblp(node, title, author) {
    let span = putEmptyRankSpan(node)
    // span.text("hello world")
    chrome.runtime.sendMessage({by: 'dblp', title:title, author: author})
        .then(({rank:rank, abbr:abbr}) => setRankSpan(span, rank, abbr))
    
}

function showRank_abbr(node, abbr) {
    let span = putEmptyRankSpan(node)
    chrome.runtime.sendMessage({by: 'abbr', abbr:abbr})
        .then(({rank:rank, abbr:abbr }) => setRankSpan(span, rank, abbr))
}

function showRank_url(node, url) {
    let span = putEmptyRankSpan(node)
    chrome.runtime.sendMessage({by: 'url', url:url})
        .then(({rank:rank, abbr:abbr, fullname:fullname }) => setRankSpan(span, rank, abbr, fullname))
}