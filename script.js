// ==UserScript==
// @name         Open in Invidious Link
// @require  https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require https://code.jquery.com/jquery-3.7.1.min.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a button to open link in invidious, so I can browse youtube recommendations and watch them w/o ads
// @author       Andrew Barlow
// @match        https://youtube.com/*
// @match        https://www.youtube.com/*
// @match        https://youtube.com/watch*
// @match        https://www.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// ==/UserScript==

// define invidious instance globally
const invidiousInstance = "yewtu.be";

// overly verbose naming perhaps, but that's the cost of code clarity
function convertYoutubeLinkToInvidious(url) {
  return url.replace("youtube.com", invidiousInstance);
}

function addButtonToVideo(url) {

    // get url of video on invidious
    const newVideoURL = convertYoutubeLinkToInvidious(url);

    // define html button to open invidious tab
    const buttonHTML = `
  <button
  class="yt-spec-button-shape-next yt-spec-button-shape-next--tonal
  yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m"
  id="invidiousButton">

    <a id="invidiousLink" target="_blank" href=${newVideoURL}>Open in Invidious</a>

  </button>
`
    // custom css for my button
    const style = document.createElement('style');
    style.innerHTML = `
        #invidiousLink {
        color: #fff;
        }
        #invidiousLink:visited {
        color: #fff;
    `;

    // insert CSS into DOM
    document.head.appendChild(style);

    // create button DOM object
    let buttonElement = document.createElement('div');
    buttonElement.innerHTML = buttonHTML;

    // find where to insert button in DOM
    const targetQuery = '#top-level-buttons-computed';

    // wait for target element to load before attempting to insert
    // https://stackoverflow.com/questions/12897446/userscript-to-wait-for-page-to-load-before-executing-code-techniques
    waitForKeyElements(targetQuery, function() {
        const target = document.querySelector(targetQuery);

        console.log(target);

        // insert button into DOM
        target.parentNode.insertBefore(buttonElement, target);

    });
}

function addButtonsToSearch(url) {
  // TODO add links for search results
  return;
}


function addButtonsToHome(url) {
  const videos = document.querySelector("ytd-rich-item-renderer");

  videos.foreach(video => {
    // get youtube link
    const originalLink = video.querySelector("a#thumbnail").href;
    console.log(originalLink)
    const byline-container = video.querySelector("div#byline-container");
    //
    // TODO add link to right of byline container

    // "https://docs.invidious.io/images/invidious.png"
    // byline-container.appendChild()
  })
}

(function() {
    'use strict';

    // get url of current page
    const currentURL = window.location.toString();

    if (currentURL.includes("watch")){
      addButtonToVideo(currentURL);
    }
    else if (currentURL.includes("search")) {
      addButtonsToSearch(currentURL);
    }
    else {
      waitForKeyElements("ytd-rich-item-renderer", addButtonsToHome(currentURL))
    }
})();
