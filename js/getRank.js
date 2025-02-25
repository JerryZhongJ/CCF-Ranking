/**
Copyright (c) 2019-2023 JerryZhongJ (https://github.com/JerryZhongJ/)
Copyright (c) 2019-2023 WenyanLiu (https://github.com/WenyanLiu/CCFrank4dblp), Kai Chen (https://github.com/FunClip)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
import { URL2Rank } from "./data/url_rank.js";
import { URL2Abbr } from "./data/url_abbr.js";
import { abbr2Fullname } from "./data/abbr_fullname.js";
import { URL2LongURL } from "./data/url_longurl.js";
import { fullname2Url } from "./data/fullname_url.js";

async function processResponse(response) {
  if (!response.ok) {
    throw Error("HTTP-Error: " + response.status);
  }

  let final_rank = "NONE";
  let final_abbr = "";

  let content = await response.json();
  for (let {
    url: dblp_url,
    number: dblp_number,
    venue: dblp_abbr,
  } of getDblpInfos(content)) {
    for (let { rank: rank, abbr: abbr } of getRanks(
      dblp_url,
      dblp_number,
      dblp_abbr
    )) {
      if (rank !== undefined && (final_rank == "NONE" || final_rank > rank)) {
        final_rank = rank;
        final_abbr = abbr;
      }
    }
  }
  return {
    rank: final_rank,
    abbr: final_abbr,
    fullname: abbr2Fullname[final_abbr],
  };
}

function* getDblpInfos(res) {
  var hits = res.result.hits;
  if (hits["@total"] == 0) {
    return;
  }

  for (let hit of hits.hit) {
    let info = hit.info;
    let url = info.url;
    yield {
      url: url.substring(url.indexOf("/rec/") + 4, url.lastIndexOf("/")),
      number: info.number,
      venue: info.venue,
    };
  }
}

function getRankByURL(url) {
  let rank = "";
  let abbr;
  url = URL2LongURL[url];
  rank = URL2Rank[url];

  if (rank !== undefined) abbr = URL2Abbr[url];
  else rank = "NONE";

  return { rank: rank, abbr: abbr, fullname: abbr2Fullname[abbr] };
}

function getRankByAbbr(abbr) {
  let full = abbr2Fullname[abbr];
  let url = fullname2Url[full];
  let rank = URL2Rank[url];
  if (rank === undefined) rank = "NONE";
  return { rank: rank, abbr: abbr, fullname: abbr2Fullname[abbr] };
}

function* getRanks(dblp_url, dblp_number, dblp_venue) {
  yield getRankByURL(dblp_url);
  yield getRankByAbbr(dblp_number);
  yield getRankByAbbr(dblp_venue);
}

chrome.runtime.onMessage.addListener((message, messageSender, sendResponse) => {
  if (message.type !== "get rank") return false;
  let _sendResponse = (response) => {
    if (response === undefined) {
      console.log("Sending undefined");
    }
    sendResponse(response);
  };
  switch (message.by) {
    case "dblp":
      var parameters = new URLSearchParams({
        q: message.title,
        author: message.author,
        format: "json",
      });
      fetch("https://dblp.org/search/publ/api?" + parameters, /*{
        keepalive: true,
      }*/)
        .then(processResponse)
        .then(_sendResponse)
        .catch(console.error);
      return true;
    case "abbr":
      sendResponse(getRankByAbbr(message.abbr));
      break;
    case "url":
      sendResponse(getRankByURL(message.url));
      break;
  }
});
