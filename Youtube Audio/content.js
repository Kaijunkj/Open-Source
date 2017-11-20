function setYouTubeAudioURL(videoElement, url)
{
    function setAudioURL()
    {
        if (videoElement.src  != url)
        {
            videoElement.pause();
            videoElement.src = url;
            videoElement.currentTime = 0;
            videoElement.play();
        }
    }
    setAudioURL();
    return setAudioURL;
}
