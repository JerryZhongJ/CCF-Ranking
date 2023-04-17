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


async function processResponse(response) {
    if (!response.ok) {
        throw new Error(response.statusText);
    }

    let final_rank = "NONE"
    let final_abbr = ""

    content = await response.json()
    for (let { url:dblp_url, number:dblp_number, venue:dblp_abbr }of getDblpInfos(content)) {
        for (let { rank:rank, abbr:abbr } of getRanks(dblp_url, dblp_number, dblp_abbr)) {
            if (rank !== undefined && (final_rank == "NONE" || final_rank > rank)) {
                final_rank = rank
                final_abbr = abbr
            }
        }
    }

    return {rank: final_rank, abbr: final_abbr}

}


function *getDblpInfos(res) {

    var hits = res.result.hits
    if (hits["@total"] == 0) {
        return
    }
        
    for(let hit of hits.hit){
        info = hit.info
        url = info.url
        yield {
            url: url.substring(
                url.indexOf("/rec/") + 4,
                url.lastIndexOf("/")
            ),
            number: info.number,
            venue: info.venue
        };
        
    }
}



function *getRanks(dblp_url, dblp_number, dblp_venue) {
    dblp_url = URL2LongURL[dblp_url]
    yield getRankByURL(dblp_url)
    yield getRankByAbbr(dblp_number)
    yield getRankByAbbr(dblp_venue)
    
}

chrome.runtime.onMessage.addListener((message, sendResponse) => {
    var parameters = new URLSearchParams(
        {
            q: message.title,
            author: message.author,
            format: "json"
        }
    );
    fetch("https://dblp.org/search/publ/api?" + parameters)
        .then(processResponse)
        .then((rank_abbr) => sendResponse(rank_abbr))
        .catch(error => {
            chrome.extension.getBackgroundPage().console.error(error)
        })
  });
