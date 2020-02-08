var searchBtn = document.querySelector(".search button");
var videoList = document.querySelector(".video-list");
var key = "AIzaSyBsZlCiN7PJVrEH1UdPrTKJB26Sk_NV8ug";
var loader = document.querySelector(".loader");
var videoPreview = document.querySelector(".video-preview");

function onSearch() {
  var searchField = document.querySelector(".search input");
  videoPreview.innerHTML = "";

  searchField.value.trim() && getVideos(searchField.value);
  searchField.value = "";
}

// initialize functions

function getVideos(searchValue) {
  var req = new XMLHttpRequest();

  req.open(
    "GET",
    "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=" +
      searchValue +
      "&key=" +
      key
  );

  req.onload = function() {
    listVideos(JSON.parse(req.responseText).items);
    loader.style.display = "none";
    videoList.style.display = "block";
  };

  req.send();
  loader.style.display = "block";
  videoList.style.display = "none";
}

function listVideos(videos) {
  videoList.innerHTML = "";
  if (!videoPreview.innerHTML) {
    videoPreview.innerHTML = "";
  }
  videos.forEach(function(video) {
    addVideo(video);
  });
}

function addVideo(videoData) {
  var videoDiv = document.createElement("div");

  var img =
    '<div class="img-wrapper"><img src="' +
    videoData.snippet.thumbnails.medium.url +
    '"/></div>';
  var title = "<h3>" + videoData.snippet.title + "</h3>";
  var desc =
    "<div class = 'description'>" + videoData.snippet.description + "</div>";

  videoDiv.innerHTML = img + "<section>" + title + desc + "</section>";
  videoList.appendChild(videoDiv);

  videoDiv.querySelectorAll("h3, img").forEach(function(element) {
    element.addEventListener("click", function() {
      openVideo(videoData.id.videoId);
    });

    element.addEventListener("click", function() {
      getRelatedVideos(videoData.id.videoId);
    });
  });
}

function openVideo(id) {
  videoPreview.innerHTML =
    '<iframe width="100%" height="720" src="https://www.youtube.com/embed/' +
    id +
    '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
}

function getRelatedVideos(id) {
  var relatedVideosRequest = new XMLHttpRequest();

  relatedVideosRequest.open(
    "GET",
    " https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&relatedToVideoId=" +
      id +
      "&type=video&key=" +
      key
  );

  relatedVideosRequest.onload = function() {
    listVideos(JSON.parse(relatedVideosRequest.responseText).items);
  };

  relatedVideosRequest.send();
}

searchBtn.addEventListener("click", onSearch);
