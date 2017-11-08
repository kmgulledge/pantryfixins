var videos = [
    "media/stirfry1.mov",
    "media/stirfry2.mov",
    "media/stirfry3.mov",
    "media/stirfry4.mov",
    "media/stirfry5.mov",
];

var videoCount = videos.length;
var i=0;

document.getElementById("videoLoop").setAttribute("src",videos[0]);

  function videoPlay(videoNum)
    {
        document.getElementById("videoLoop").load();
        document.getElementById("videoLoop").play();
    };

document.getElementById('videoLoop').addEventListener('ended',myHandler,false);

  function myHandler() {
      i++;
      document.getElementById("videoLoop").setAttribute("src",videos[i]);
      videoPlay(i);
      if(i == (videoCount-1)){
      i = 0;
      videoPlay(i);
      };
  };