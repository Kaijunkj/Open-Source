function makeSetAudioURL(videoElement, url) {
    function setAudioURL() {
        if (videoElement.src  != url) {
            videoElement.pause();
            videoElement.src = url;
            videoElement.currentTime = 0;
            videoElement.play();
        }
    }
    setAudioURL();
    return setAudioURL;
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        var url = request.url;
        var videoElements = document.getElementsByTagName('video');
        var videoElement = videoElements[0];
        if (typeof videoElement == "undefined") {
            console.log("Audio Only Youtube - Video element undefined in this frame!");
            return;
        }