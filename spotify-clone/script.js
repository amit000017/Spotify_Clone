console.log("hello champ!!")

let currentsong = new Audio;
let songs;
let curfolder;

async function getsongs(folder) {
    curfolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)

    let response = await a.text();
    

    let div = document.createElement("div")

    div.innerHTML = response;
    let atag = div.getElementsByTagName("a");
    
    songs = []
    for (let i = 0; i < atag.length; i++) {
        const element = atag[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML = ""

    for (const song of songs) {
        songul.innerHTML += `<li><img class="invert" src="music.svg" alt="music">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Song Artist</div>
                            </div>
                            <div class="playnow">
                                Play Now
                                <img class="invert" src="play.svg" alt="play">
                            </div>
                        </li>`;
    }



    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {

            playMusic((e.querySelector(".info").firstElementChild.innerHTML))
        })
    })

    return songs

}

getsongs()
const playMusic = (music, pause = false) => {

    currentsong.src = `/${curfolder}/` + music
    if (!pause) {
        currentsong.play()
        play.src = "pause.svg"
    }


    document.querySelector(".songinfo").innerHTML = decodeURI(music)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}


async function displayalbums() {
    let a = await fetch(`http://127.0.0.1:5500/songs/`)

    let response = await a.text();
    let cardcontainer=document.querySelector(".cardcontainer")


    let div = document.createElement("div")

    div.innerHTML = response;

  


    let anchors=div.getElementsByTagName("a")
  

   let array= Array.from(anchors)
   for(let i=0;i<array.length;i++){
    const e=array[i];
   
    
        if(e.href.includes("/songs/")){
           let folder= e.href.split("/").slice(-2)[1]
           //get json meta data
          

           let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)

          let response = await a.json();

      
          cardcontainer.innerHTML=cardcontainer.innerHTML + `<div data-folder="${folder}" class="card">
          <div class="play"><img src="cardd.svg" alt="hi"></div>
          <img aria-hidden="false" draggable="false" loading="lazy"
              src="/songs/${folder}/cover.jpeg"
              alt="Yeh Jawaani Hai Deewani"
              class="mMx2LUixlnN_Fu45JpFB CmkY1Ag0tJDfnFXbGgju _EShSNaBK1wUIaZQFJJQ Yn2Ei5QZn19gria6LjZj"
             
              sizes="(min-width: 1280px) 232px, 192px">
          <h3>${response.title}</h3>
          <p>${response.discription}</p>
      </div>`
        }

    }
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
                playMusic(songs[0])
        })


    })
    
}

async function main() {
    await getsongs("songs/panjabi")
    playMusic(songs[0], true)


    displayalbums()

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "play.svg"

        }
    })
    function convertSecondsToMinutes(seconds) {
        if (isNaN(seconds) || seconds < 0) {
            return "00:00"
        }
        const minutes = Math.floor(seconds / 60);

        // Calculate the remaining seconds
        const remainingSeconds = Math.floor(seconds % 60);

        const formattedminutes = String(minutes).padStart(2, '0')
        const formattedremainingSeconds = String(remainingSeconds).padStart(2, '0')



        // Return the formatted time without padding zeros
        return `${formattedminutes} :${formattedremainingSeconds}`;
    }



    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${convertSecondsToMinutes(currentsong.currentTime)}/
    ${convertSecondsToMinutes(currentsong.duration)}`

        document.querySelector(".circle").style.left = ((currentsong.currentTime) / currentsong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        var percentage = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percentage + "%";
        currentsong.currentTime = ((currentsong.duration) * percentage) / 100;

    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        
        if (index - 1 >= 0) {
            playMusic(songs[index - 1])

        }
        else {
            playMusic(songs[songs.length - 1])
        }


    })

    next.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1])
            
        }
        else {
            playMusic(songs[0])
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentsong.volume = parseInt(e.target.value) / 100
    })

    let previouss=0.5;
    document.querySelector(".volume>img").addEventListener("click",e=>{
        
        
       
        if(e.target.src.includes("volume.svg")){
            
            
           
            e.target.src=e.target.src.replace("volume.svg","mute.svg")
           previouss=currentsong.volume;
            currentsong.volume=0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0;
        }
        else{
            e.target.src= e.target.src.replace("mute.svg","volume.svg")
           
            currentsong.volume=previouss;
            document.querySelector(".range").getElementsByTagName("input")[0].value=previouss*100;
        }
    })

    
}

main()