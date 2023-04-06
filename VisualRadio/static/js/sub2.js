
var radio_name = '';
var date = '';
var subtitlesObj;
const audio = document.getElementById("audio");
const subtitleContainer = document.getElementById("subtitleContainer");
var subtitles = [];
let highlightedSubtitleIndex = -1;
// const source = "http://localhost:8080"
const source = "http://localhost:5000"

window.onload = function() {
  getInfo().then(() => {
      getScript().then(() => startSubtitles());
      getWave();
  });
  
  const progress = document.querySelector('.progress');
  const progressBar = document.querySelector('.progress-bar')
  const currentTimeText = document.getElementById('currentTime');
  const durationText = document.getElementById('duration');
  
  audio.addEventListener('timeupdate', () => {
      const currentTime = audio.currentTime;
      const duration = audio.duration;
      const progress_time = currentTime / duration;
      progress.style.width = `${progress_time * 100}%`;
      const minutes = Math.floor(audio.currentTime / 60);
      const seconds = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
      currentTimeText.innerText = `${minutes}:${seconds}`;
  });
  
    audio.addEventListener('loadedmetadata', () => {
      const minutes = Math.floor(audio.duration / 60);
      const seconds = Math.floor(audio.duration % 60).toString().padStart(2, '0');
      durationText.innerText = `${minutes}:${seconds}`;
    });
  
    progressBar.addEventListener('click', (event) => {
      const barWidth = progressBar.clientWidth;
      const clickedPosition = event.clientX - progressBar.getBoundingClientRect().left;
      const newTime = (clickedPosition / barWidth) * audio.duration;
      audio.currentTime = newTime;
      progressBar.value = audio.duration;
      showImageAtCurrentTime();
    });
  }



function getInfo() {
  return fetch(`${source}/program_info`)
  .then((response) => response.json())
  .then((data) => 
      {radio_name = data.radio_name;
       date       = data.date;
       document.getElementById('info').innerHTML = `${radio_name}  ${date}`})
}

function getScript() {
  return fetch(`${source}/${radio_name}/${date}/script`)
    .then((response) => response.json())
    .then((data) => {
      subtitlesObj = data;
      
      // console.log(data);
      return data;
    });
}


function timeStringToFloat(time) {
    const [minutes, seconds] = time.split(':');
    const [secondsWithoutFraction] = seconds.split('.');
    const fraction = parseInt(seconds.split('.')[1]) || 0;
    const totalSeconds = parseInt(minutes) * 60 + parseInt(secondsWithoutFraction) + fraction / 1000;
    return parseFloat(totalSeconds.toFixed(3));
}

function startSubtitles() {
    const subtitlesWithTime = subtitlesObj.map(subtitle => ({
      txt: subtitle.txt,
      time: timeStringToFloat(subtitle.time)
    }));
  
    subtitlesWithTime.forEach(subtitle => {
      const block = document.createElement('div');
      block.innerText = subtitle.txt;
      block.addEventListener('click', () => {
        audio.currentTime = subtitle.time;
        showImageAtCurrentTime();

      });
      subtitleContainer.appendChild(block);
    });

    const containerHeight = subtitleContainer.getBoundingClientRect().height;
    const subtitleHeight = subtitleContainer.children[0].getBoundingClientRect().height;  
    audio.addEventListener('timeupdate', () => {
        const currentTime = audio.currentTime;
        for (let i = 0; i < subtitlesWithTime.length; i++) {
          const subtitle = subtitlesWithTime[i];
          const nextSubtitle = subtitlesWithTime[i + 1];
          if (nextSubtitle && nextSubtitle.time <= currentTime) {
            continue;
          }
          if (subtitle.time <= currentTime) {
            // 현재 재생 중인 자막을 강조합니다.
            subtitleContainer.children[i].style.fontWeight = 'bold';
            highlightedSubtitleIndex = i;
          } else {
            subtitleContainer.children[i].style.fontWeight = 'normal';
          }
        }
        // 나머지 자막들의 스타일을 일괄적으로 normal로 설정합니다.
        if (highlightedSubtitleIndex !== -1) {
          for (let i = 0; i < subtitlesWithTime.length; i++) {
            if (i !== highlightedSubtitleIndex) {
              subtitleContainer.children[i].style.fontWeight = 'normal';
            }
          }
        }
      
        // 강조 중인 자막이 항상 중앙에 오도록 스크롤 위치를 조정합니다.
        if (highlightedSubtitleIndex !== -1) {

            const highlightedSubtitle = subtitleContainer.children[highlightedSubtitleIndex];
            const containerTop = subtitleContainer.getBoundingClientRect().top;
            const highlightedSubtitleTop = highlightedSubtitle.getBoundingClientRect().top - containerTop;
            const subtitleHeight = highlightedSubtitle.getBoundingClientRect().height;
            const containerHeight = subtitleContainer.getBoundingClientRect().height;
            const scrollAmount = highlightedSubtitleTop - containerTop;
            subtitleContainer.scrollTo({
                top: subtitleContainer.scrollTop + scrollAmount+subtitleHeight*2,
                behavior: 'smooth',
            });
        }
      });
    }

function sleep(ms) {
    const wakeUpTime = Date.now() + ms;
    while (Date.now() < wakeUpTime) {}
}
  
function getWave() {
  fetch(`${source}/${radio_name}/${date}/wave`)
  .then((response) => response.blob())
  .then((blob) => {
      const audioURL = URL.createObjectURL(blob); // 오디오 파일의 URL 생성
      document.getElementById('audio').src = audioURL; // <audio> 태그의 src 속성 설정
  })
}


function parseTime(timeString) {
  const [min, secMillisec] = timeString.split(':');
  const [sec, millisec] = secMillisec.split('.');
  return (+min * 60 + +sec) * 1000 + +millisec;
}

let audioCurrentTime = 0;

audio.addEventListener('timeupdate', () => {
  audioCurrentTime = audio.currentTime;
});

let currentIndex=0;
const mainImg = document.getElementById('main_img');

function getImg() {
  fetch(`${source}/${radio_name}/${date}/images`)
    .then(response => response.json())
    .then(data => {
      // console.log(currentIndex);
      const { img_url, time } = data[currentIndex];
      var nextImgTime;

      // preload the next image
      if (currentIndex < data.length - 1) {
        const nextImg = new Image();
        const nextImgUrl = `${data[currentIndex + 1].img_url}`;
        nextImgTime = parseTime(data[currentIndex + 1].time) / 1000;
        nextImg.src = nextImgUrl;
      }

      // display the current image
      mainImg.src = img_url;
      const timeDiff = Math.abs(audioCurrentTime - nextImgTime);
      console.log(timeDiff);

      // check if it's time to switch to the next image
      // if (timeDiff < 0.1 && timeDiff > 0) {
      if (timeDiff > 0 && timeDiff < 0.08) {
        currentIndex = (currentIndex + 1) % data.length;
        const nextImgUrl = `${data[currentIndex].img_url}`;
        // preload the image after the next image
        if (currentIndex < data.length - 1) {
          const nextNextImg = new Image();
          const nextNextImgUrl = `${data[currentIndex + 1].img_url}`;
          nextNextImg.src = nextNextImgUrl;
        }
        mainImg.src = nextImgUrl;
      }

    })
    .catch(error => {
      console.error('Error fetching image:', error);
    });
}

function preload(url) {
  const img = new Image();
  img.src = url;
}

function startImageChecking() {
  // console.log('반복 시작')
  setInterval(() => {
      getImg();
    }, 1000);
  }

startImageChecking();

function showImageAtCurrentTime() {
  fetch(`${source}/${radio_name}/${date}/images`)
    .then(response => response.json())
    .then(data => {
      const audioCurrentTime = audio.currentTime;
      let closestTimeDiff = Number.MAX_SAFE_INTEGER;
      let closestImgUrl = '';
      let i = -1;
      let closetIndex;
      data.forEach(({ img_url, time }) => {
        i++;
        const timeInMillisec = time ? parseTime(time) : 0;
        const imgTime = timeInMillisec / 1000;
        const timeDiff = Math.abs(audioCurrentTime - imgTime);

        if (timeDiff < closestTimeDiff && imgTime < audioCurrentTime) {
          closetIndex = i;
          closestTimeDiff = timeDiff;
          closestImgUrl = img_url;
        }
      });

      mainImg.src = closestImgUrl;
      currentIndex = closetIndex;
      startImageChecking();
    })
    .catch(error => {
      console.error('Error fetching image:', error);
    });
}

const playPauseBtn = document.getElementById("play-pause-btn");

playPauseBtn.addEventListener("click", function() {
  if (audio.paused) {
    audio.play();
    playPauseBtn.innerHTML = '<i class="fa fa-pause"></i>';
    playPauseBtn.innerText = "일시정지";
  } else {
    audio.pause();
    playPauseBtn.innerHTML = '<i class="fa fa-play"></i>';
    playPauseBtn.innerText = "재생";
  }
});