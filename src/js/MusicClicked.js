function musicClicked( div ){
    albumArt = $(div)[0].firstChild.src
    setAlbumArt(albumArt)
}

function setAlbumArt(albumArt){
    backgroundImage.css("background-image", "url("+albumArt+")")
}