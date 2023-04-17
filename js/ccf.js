/**
 * MIT License
 *
 * Copyright (c) 2019-2023 WenyanLiu (https://github.com/WenyanLiu/CCFrank4dblp), Kai Chen (https://github.com/FunClip)
 */


function getRankByURL(url) {
   
    
    let rank;
    let abbr;
    rank = URL2Rank[url];

    if (rank !== undefined) {
        abbr = URL2Abbr[url];
    }

    return {rank: rank, abbr: abbr};
};

function getRankByAbbr(abbr) {
    let full = abbr2Fullname[abbr];
    let url = fullname2Url[full];
    let rank = URL2Rank[url];
    return {rank: rank, abbr: abbr}
}

function getRankFromDBLP(title, author) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
            message = { title: title, author: author },
            callback = (rank_abbr) => {
                
                resolve(rank_abbr)
                
            }
        )
    })
}


function putEmptyRankSpan(node) {
    return $("<span>").addClass("ccf-rank").insertAfter(node);
    
};

function setRankSpan(span, rank, abbr) {
    span.addClass(`ccf-${rank}`.toLowerCase())
        .text("CCF " + rank);
    span.addClass("ccf-tooltip")
        .append($("<pre>").addClass("ccf-tooltiptext").text(abbr + " - " + abbr2Fullname[abbr]));
}

function showRank_dblp(node, title, authorA) {
    let span = putEmptyRankSpan(node)
    // span.text("hello world")
    getRankFromDBLP(title, authorA)
        .then(({rank:rank, abbr:abbr}) => putEmptyRankSpan(span), rank, abbr)
    
}

function showRank_abbr(node, abbr) {
    let { rank:rank } = getRankByAbbr(abbr);
    setRankSpan(putEmptyRankSpan(node), rank, abbr)
}

function showRank_url(node, url) {
    let { rank:rank, abbr:abbr } = getRankByURL(url);
    setRankSpan(putEmptyRankSpan(node), rank, abbr)
}