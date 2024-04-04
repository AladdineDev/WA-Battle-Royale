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

    safeZoneHandler();

}).catch(e => console.error(e));

function closePopup() {
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

const tileCoordinatesFromMap = (x: number, y: number) => {
    const TILE_SIZE = 32;
    return {
        x: Math.floor(x / TILE_SIZE),
        y: Math.floor(y / TILE_SIZE)
    };
}

const safeZoneHandler = async () => {
    console.debug('Test function called');
    const safeZoneLayerName = 'floor/safeZone';
    const FIRE_ANIM_TILE_ID = 4;

    const safeZoneArea = WA.room.area.create({
        width: 1000,
        height: 1000,
        name: "safeZoneArea",
        x: 0,
        y: 0,
    });

    WA.room.area.onEnter(safeZoneArea.name).subscribe(() => {
        console.debug('Entered safeZoneArea');
    });
    WA.room.area.onLeave(safeZoneArea.name).subscribe(() => {
        console.debug('Left safeZoneArea');
    });
    console.debug('safeZoneArea', safeZoneArea);


    WA.player.onPlayerMove(({ direction, moving, x, y, oldX, oldY }) => {
        console.debug('Player moved', { direction, moving, x, y, oldX, oldY });
        const tileCoordinates = tileCoordinatesFromMap(x, y);
        WA.room.setTiles([
            { x: tileCoordinates.x, y: tileCoordinates.y, tile: FIRE_ANIM_TILE_ID, layer: safeZoneLayerName },
        ]);
    });



    WA.room.setTiles([
        // { x: 3, y: 5, tile: 0, layer: safeZoneLayerName },
        { x: 4, y: 5, tile: 1, layer: safeZoneLayerName },
        { x: 1, y: 2, tile: FIRE_ANIM_TILE_ID, layer: safeZoneLayerName },
        { x: 9, y: 10, tile: FIRE_ANIM_TILE_ID, layer: safeZoneLayerName },
    ]);

    const onEnter = WA.room.onEnterLayer(safeZoneLayerName);
    const onLeave = WA.room.onLeaveLayer(safeZoneLayerName);
    onEnter.subscribe(() => {
        console.debug('Entered safeZone');
    });
    onLeave.subscribe(() => {
        console.debug('Left safeZone');
    });


}

export { };
