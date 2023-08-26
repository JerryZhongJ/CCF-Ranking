
if (window.location.hostname.startsWith("dblp")) {
    dblp.run();
} else if (window.location.hostname.startsWith("scholar.google")) {
    scholar.run();
} else if (window.location.hostname.includes("connectedpapers")) {
    connectedpapers.run();
} else if (window.location.hostname.includes("semanticscholar")) {
    semanticscholar.run();
} 