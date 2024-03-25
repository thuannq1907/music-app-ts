// Play Audio
const elementAplayer = document.getElementById('aplayer');

if(elementAplayer) {
  // t.tin bài hát
  let dataSong = elementAplayer.getAttribute("data-song");
  dataSong = JSON.parse(dataSong);
  // t.tin ca sĩ
  let dataSinger = elementAplayer.getAttribute("data-singer");
  dataSinger = JSON.parse(dataSinger);

  const ap = new APlayer({
    container: elementAplayer,
    lrcType: 1,
    audio: [{
        name: dataSong.title,
        artist: dataSinger.fullName,
        url: dataSong.audio,
        cover: dataSong.avatar,
        lrc: dataSong.lyrics
    }],
    autoplay: true
  });

  const avatar = document.querySelector(".singer-detail .inner-avatar");

  ap.on('ended', function () {
    const link = `/songs/listen/${dataSong._id}`;
    fetch(link, {
      method: "PATCH"
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
  });

  ap.on('play', function () {
    avatar.style.animationPlayState = "running";
  });

  ap.on('pause', function () {
    avatar.style.animationPlayState = "paused";
  });
}
// End Play Audio


// Button Like
const buttonLike = document.querySelector("[button-like]");
if(buttonLike) {
  // khi click vào buttonLike thì call đến api /songs/like/:type/:idSong 
  buttonLike.addEventListener("click", () => {
    // check xem button đó class active chưa, có r -> muốn bỏ like, chưa có -> muốn like
    const isActive = buttonLike.classList.contains("active");

    const typeLike = isActive ? "no" : "yes";

    // lấy id bài hát thông qua thuộc tính button-like=song.id tự định nghĩa
    const idSong = buttonLike.getAttribute("button-like");
    const link = `/songs/like/${typeLike}/${idSong}`;

    // call api
    fetch(link, {
      method: "PATCH"
    })
      .then(res => res.json())
      .then(data => {
        // update lại lượt like ngoài giao diện
        const spanLike = buttonLike.querySelector("[data-like]");
        spanLike.innerHTML = data.like;

        // có r thì xóa, k có thì thêm vào
        buttonLike.classList.toggle("active");
      })
  });
}
// End Button Like


// Button Favorite
// vì bên trang bài hát ưa thích có nhiều nút ưa thích -> phải lấy ra tất cả
const listButtonFavorite = document.querySelectorAll("[button-favorite]");
if(listButtonFavorite.length > 0) {
  listButtonFavorite.forEach(buttonFavorite => {
    buttonFavorite.addEventListener("click", () => {
      const isActive = buttonFavorite.classList.contains("active");
  
      const typeFavorite = isActive ? "no" : "yes";
  
      const idSong = buttonFavorite.getAttribute("button-favorite");
      const link = `/songs/favorite/${typeFavorite}/${idSong}`;
      fetch(link, {
        method: "PATCH"
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          buttonFavorite.classList.toggle("active");
        })
    });
  })
}
// End Button Favorite

// Search 
const inputSearch = document.querySelector(".box-search input[name='keyword']");
if(inputSearch){
  inputSearch.addEventListener("keyup", () => {
    const value = inputSearch.value;
    const link = `/search/keyword/${value}`;
    const boxSearch = document.querySelector(".box-search form");
    fetch(link, {
      method: "GET"
    })
      .then(res => res.json())
      .then(data => {
        const songs = data.songs;
        const boxResult = document.createElement("div");
        boxResult.classList.add("box-result");
        songs.forEach(song => {
          const div = document.createElement("div");
          div.innerHTML = `
              <a href="/songs/detail/${song.slug}">${song.title}</a>
          `;
          boxResult.appendChild(div);
        });
        boxSearch.appendChild(boxResult);
        const countBoxResult = document.querySelectorAll(".box-result");
        for (var i = 0; i < countBoxResult.length; i++) {
          if(i !== countBoxResult.length-1){
            countBoxResult[i].remove();
          }
          setTimeout(() => {
            countBoxResult[countBoxResult.length-1].remove();
          }, 2000)
        }
      })
  })
}
// End Search 