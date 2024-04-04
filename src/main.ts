/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');

let currentPopup: any = undefined;
let hp: string = "❤️❤️❤️";
// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ',WA.player.tags)
    Player.initPlayerVariables(WA.player);

    WA.room.area.onEnter('clock').subscribe(() => {
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes();
        currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
    })

    WA.ui.banner.openBanner({
        id: "banner-hp",
        text: "PV : " + hp,
        bgColor: "#000000",
        textColor: "#ffffff",
        closable: false,
        timeToClose: 0,
    });
    

    WA.room.area.onEnter('bombe').subscribe(() => {
        WA.player.setOutlineColor(255, 0, 0);
        setTimeout(() => {
            WA.player.removeOutlineColor();
        }, 100);
        hp = hp.slice(0, -1);
        WA.ui.banner.closeBanner();
        if (hp.length <= 0) {
            WA.ui.openPopup("clockPopup", "Tu es mort", []);
        } else {
            currentPopup = WA.ui.openPopup("clockPopup", " -1 PV", []);
            WA.ui.banner.openBanner({
                id: "banner-hp",
                text: "PV : " + hp,
                bgColor: "#000000",
                textColor: "#ffffff",
                closable: false,
                timeToClose: 0,
            });
        }
    });
    

    WA.room.area.onLeave('bombe').subscribe(closePopup)

    WA.room.area.onEnter('champignon').subscribe(() => {
        WA.player.setOutlineColor(0, 255, 0);
    })

    WA.room.area.onLeave('champignon').subscribe(() => {
        setTimeout(() => {
            WA.player.removeOutlineColor();
        }, 15000);
    })
    
    WA.room.area.onLeave('clock').subscribe(closePopup)

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

function closePopup(){
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

export {};