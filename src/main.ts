/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');

let currentPopup: any = undefined;

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ', WA.player.tags)

    WA.room.area.onEnter('clock').subscribe(() => {
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes();
        currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
    })

    WA.room.area.onLeave('clock').subscribe(closePopup)

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

    WA.ui.actionBar.addButton({
        type: "action",
        label: "Inventaire",
        toolTip: "Ouvrir l'inventaire",
        id: "open-inventory",
        imageSrc: "https://icons.veryicon.com/png/o/healthcate-medical/medical-profession-1/ico-warehouse-management-inventory-1.png",
        callback: async () => {
            const website = await WA.ui.website.open({ 
                position: { horizontal: "left", vertical: "bottom" }, 
                size: { width: "100%", height: "100%" },
                allowApi: true,
                url: "./src/iframe.html",
                visible: true
            });
        }
    });

}).catch(e => console.error(e));

function closePopup() {
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

export { };
