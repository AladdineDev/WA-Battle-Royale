/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import { SetupHandler } from "./Handler/setupHandler";
import Player from "./player";
import { UIWebsite } from "@workadventure/iframe-api-typings";
console.log('Script started successfully');

let currentPopup: any = undefined;
let coeur: string = "❤️";
let top: number = 0;
// Waiting for the API to be ready
WA.onInit()
    .then(async () => {
        await WA.players.configureTracking();
        const setupHandler = new SetupHandler();
        setupHandler.init();

        let inventoryIframe: UIWebsite;
        WA.ui.actionBar.addButton({
            type: "action",
            label: "Inventaire",
            toolTip: "Ouvrir l'inventaire",
            id: "open-inventory",
            imageSrc: "https://icons.veryicon.com/png/o/healthcate-medical/medical-profession-1/ico-warehouse-management-inventory-1.png",
            callback: async () => {
                if (inventoryIframe) {
                    inventoryIframe.visible = !inventoryIframe.visible
                    return;
                }
                inventoryIframe = await WA.ui.website.open({
                    position: { horizontal: "left", vertical: "bottom" },
                    size: { width: "100%", height: "100%" },
                    allowApi: true,
                    url: "iframe.html",
                    visible: true
                });
                inventoryIframe.url = `${inventoryIframe.url}?id=${inventoryIframe.id}`;
            }
        });

        console.log("Scripting API ready");
        console.log("Player tags: ", WA.player.tags);
        Player.initPlayerVariables(WA.player);
        Player.onLifePointEqualsZero(WA.player, () => {
            WA.player.teleport(60, 92);
        });

        WA.room.area.onEnter("clock").subscribe(() => {
            const players = WA.players.list();
            console.log(players);
            for (const player of players) {
                console.log(`Player ${player.name} is near you`);
            }
            const today = new Date();
            const time = today.getHours() + ":" + today.getMinutes();
            currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
        });

        WA.ui.banner.openBanner({
            id: "banner-hp",
            text:
                "PV : " +
                coeur.repeat(WA.player.state.lifePoint as number) +
                " TOP : " +
                top,
            bgColor: "#000000",
            textColor: "#ffffff",
            closable: false,
            timeToClose: 0,
        });

        WA.room.area.onEnter("bombe").subscribe(() => {
            WA.player.setOutlineColor(255, 0, 0);
            setTimeout(() => {
                WA.player.removeOutlineColor();
            }, 100);
            WA.ui.banner.closeBanner();
            Player.updateLifePoint(
                WA.player,
                (WA.player.state.lifePoint as number) - 1
            );
            if ((WA.player.state.lifePoint as number) <= 0) {
                WA.ui.openPopup("clockPopup", "Tu es mort", []);
            } else {
                WA.ui.banner.openBanner({
                    id: "banner-hp",
                    text:
                        "PV : " +
                        coeur.repeat(WA.player.state.lifePoint as number) +
                        " TOP : " +
                        top,
                    bgColor: "#000000",
                    textColor: "#ffffff",
                    closable: false,
                    timeToClose: 0,
                });
            }
        });

        WA.room.area.onEnter("champignon").subscribe(() => {
            WA.player.setOutlineColor(0, 255, 0);
        });

        WA.room.area.onLeave("champignon").subscribe(() => {
            setTimeout(() => {
                WA.player.removeOutlineColor();
            }, 15000);
        });

        WA.room.area.onLeave("clock").subscribe(closePopup);

        // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
        bootstrapExtra()
            .then(() => {
                console.log("Scripting API Extra ready");
            })
            .catch((e) => console.error(e));
    })
    .catch((e) => console.error(e));

function closePopup() {
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

export { };