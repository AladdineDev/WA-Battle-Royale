/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');

let currentPopup: any = undefined;

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ',WA.player.tags)

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

    test();

}).catch(e => console.error(e));

function closePopup(){
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

const test = async () => {
    console.debug('Test function called');
    // WA.room.setTiles([
    //     { x: 6, y: 4, tile: "blue", layer: "setTiles" },
    //     { x: 7, y: 4, tile: 109, layer: "setTiles" },
    //     { x: 8, y: 4, tile: 109, layer: "setTiles" },
    //     { x: 9, y: 4, tile: "blue", layer: "setTiles" },
    //   ]);

    const layerName = 'floor/safeZone';

    WA.room.showLayer(layerName);
    const onEnter = WA.room.onEnterLayer(layerName);
    const onLeave = WA.room.onLeaveLayer(layerName);
    onEnter.subscribe(() => {
        console.debug('Entered safeZone');
    });
    onLeave.subscribe(() => {
        console.debug('Left safeZone');
    });
    

}

export {};
