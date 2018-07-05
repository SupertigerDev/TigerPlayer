const startup = $(".startup"),
firstStartScreen = $(".firstStart"),
mainContainer = $(".mainContainer"),
musicList = $(".musicList"),
numOfMusic = $('.numOfMusic'),
spinner = $(".loader"),
backgroundImage = $(".backgroundImage");

const {
    dialog
} = require('electron').remote;
const fs = require('fs');
const Store = require('electron-store');
const store = new Store();
const asyncLoop = require('node-async-loop');

const jsmediatags = require("jsmediatags");



$(function () {

    ///store.delete("configuration")



    startup.animate({
        opacity: 1,
        marginTop: 20
    }, 300, function () {
        setTimeout(() => {

            startup.animate({
                opacity: 0,
                marginTop: 0
            }, 300, function () {
                startup.fadeOut();
                setTimeout(() => {
                    startup.css("display", "none")
                    loadUpAnimationComplete()
                }, 500)
            });

        }, 1000)

    });



    $(".browseButton").click(function (e) {
        var path = dialog.showOpenDialog({
            properties: ['openDirectory']
        });
        if (typeof path != "undefined") {
            store.set("configuration", {
                musicFolderPath: path
            })
            firstStartScreen.animate({
                opacity: 0
            }, 300, function () {
                firstStartScreen.css("display", "none")
                mainMusicScreen();
            })
        }
    });


    function loadUpAnimationComplete() {

        if (typeof store.get("configuration") == "undefined") {

            firstStartScreen.animate({
                opacity: 1
            }, 300)

        } else {
            firstStartScreen.css("display", "none")
            mainMusicScreen();
        }
    }

    function mainMusicScreen() {
        mainContainer.fadeIn();
        mainContainer.animate({
            opacity: 1
        }, 300, function () {
            musicList.fadeIn(400, function () {
                getAllMusic();
            });

        })


    }




})