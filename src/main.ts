/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import { SetupHandler } from "./Handler/setupHandler";
import { Player } from "./model/player";
import {
	RemotePlayerInterface,
	UIWebsite,
} from "@workadventure/iframe-api-typings";
import { GenerateItems, initTimerGame } from "./Controller/GameController";
import { RemotePlayerMoved } from "@workadventure/iframe-api-typings/play/src/front/Api/Iframe/Players/RemotePlayer";
console.log("Script started successfully");

// let currentPopup: any = undefined;
let timeCounter = 300; // 5 minutes
let map: any = undefined;
const mapConfig = { height: 0, width: 0 };
const numberTileLimit = 3;
let killer: RemotePlayerInterface;
let tic = 0;
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
			imageSrc:
				"https://icons.veryicon.com/png/o/healthcate-medical/medical-profession-1/ico-warehouse-management-inventory-1.png",
			callback: async () => {
				if (inventoryIframe) {
					inventoryIframe.visible = !inventoryIframe.visible;
					return;
				}
				inventoryIframe = await WA.ui.website.open({
					position: { horizontal: "left", vertical: "bottom" },
					size: { width: "100%", height: "100%" },
					allowApi: true,
					url: "iframe.html",
					visible: true,
				});
				inventoryIframe.url = `${inventoryIframe.url}?id=${inventoryIframe.id}`;
			},
		});

		console.log("Scripting API ready");
		console.log("Player tags: ", WA.player.tags);
		await Player.initPlayerVariables(WA.player);

		await Player.onLifePointEqualsZero(WA.player, () => {
			WA.player.teleport(33, 2400);
			console.log("Tu es mort" + killer);
			if (killer) {
				WA.camera.set(
					killer.position.x,
					killer.position.y,
					undefined,
					undefined,
					false,
					true
				);
			}
		});

		console.log("Scripting API ready");
		console.log("Player tags: ", WA.player.tags);
		map = await WA.room.getTiledMap();
		console.log(map);
		mapConfig.height = map.height ?? 0;
		mapConfig.width = map.width ?? 0;
    const itemLocation = await GenerateItems(map);
		initTimerGame(timeCounter, numberTileLimit, tic, mapConfig);
		await Player.initPlayerVariables(WA.player);


		/*await WA.players.configureTracking({
			players: playersConfig,
			movement: movementConfig,
		});
		console.log(
			`Player config tracking ok -> movement: ${movementConfig}, players: ${playersConfig}`
		);
		const players = WA.players.list();
		for (const player of players) {
			console.log(`Player ${player.name} is near you`);
		}
*/
		//suit le joueur qui ma tuer
		WA.players.onPlayerMoves.subscribe((event: RemotePlayerMoved) => {
			console.log(
				"Player moved",
				event.player.name,
				event.player.position.x,
				event.player.position.y
			);
			if ((WA.player.state.lifePoint as number) <= 0) {
				WA.camera.set(
					event.player.position.x,
					event.player.position.y,
					undefined,
					undefined,
					false,
					true
				);
			}
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

		//recupere le joueur qui ma tuer
		WA.players.onPlayerEnters.subscribe((killerId) => {
			killer = killerId;
			console.log("Le tueur est : " + killer?.playerId);
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
				//WA.ui.openPopup("clockPopup", "Tu es mort", []);
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

		/*WA.room.area.onEnter("champignon").subscribe(() => {
            WA.player.setOutlineColor(0, 255, 0);
        });

        WA.room.area.onLeave("champignon").subscribe(() => {
            setTimeout(() => {
                WA.player.removeOutlineColor();
            }, 15000);
        });
*/

		// The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
		bootstrapExtra()
			.then(() => {
				console.log("Scripting API Extra ready");
			})
			.catch((e) => console.error(e));
	})
	.catch((e) => console.error(e));

/*
function closePopup() {
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}*/

export {};
