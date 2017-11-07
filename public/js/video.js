var videos = [
    "media/stirfry1.MOV",
    "media/stirfry2.MOV",
    "media/stirfry3.MOV",
    "media/stirfry4.MOV",
    "media/stirfry5.MOV",
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