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
    audio: [{
        name: dataSong.title,
        artist: dataSinger.fullName,
        url: dataSong.audio,
        cover: dataSong.avatar
    }],
    autoplay: true
  });

  const avatar = document.querySelector(".singer-detail .inner-avatar");

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