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



function getRankSpan  (rank, abbr) {
    let span = $("<span>")
        .addClass("ccf-rank")
        .addClass(`ccf-${rank}`.toLowerCase())
        .text("CCF " + rank);
    
    span
        .addClass("ccf-tooltip")
        .append($("<pre>").addClass("ccf-tooltiptext").text(abbr + " - " + abbr2Fullname[abbr]));
    
    return span;
};

function showRank_dblp(node, title, authorA) {
    fetchDblp(title, authorA)
        .then(processResponse)
        .then((rank_abbr) => getRankSpan(rank_abbr.rank, rank_abbr.abbr))
        .then((span) => node.after(span))
        .catch(console.error)
}

function showRank_abbr(node, abbr) {
    let { rank:rank } = getRankByAbbr(abbr);
    if (rank === undefined) {
        return
    }
    let span = getRankSpan(rank, abbr);
    node.after(span);
}

function showRank_url(node, url) {
    let { rank:rank, abbr:abbr } = getRankByURL(url);
    if (rank === undefined) {
        return
    }
    let span = getRankSpan(rank, abbr);
    node.after(span);
}