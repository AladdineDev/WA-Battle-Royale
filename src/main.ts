/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import { SetupHandler } from "./Handler/setupHandler";
import Player from "./player";
import {RemotePlayerInterface } from "@workadventure/iframe-api-typings";
import { RemotePlayerMoved } from "@workadventure/iframe-api-typings/play/src/front/Api/Iframe/Players/RemotePlayer";

console.log("Script started successfully");

let currentPopup: any = undefined;
let coeur: string = "❤️";
let top: number = 0;
let killer : RemotePlayerInterface; 
// Waiting for the API to be ready
WA.onInit()
	.then(async () => {
		await WA.players.configureTracking();
		const setupHandler = new SetupHandler();
		setupHandler.init();
		
		console.log("Scripting API ready");
		console.log("Player tags: ", WA.player.tags);
		Player.initPlayerVariables(WA.player);
		
		Player.onLifePointEqualsZero(WA.player, () => {
			WA.player.teleport(60, 54);
			if (killer) {
				WA.camera.set(killer.position.x, killer.position.y, undefined, undefined, false, true);
			}
		});
		
		//suit le joueur qui ma tuer
		WA.players.onPlayerMoves.subscribe((event: RemotePlayerMoved) => {
			console.log("Player moved", event.player.name, event.player.position.x, event.player.position.y);
			if((WA.player.state.lifePoint as number) <= 0){
				WA.camera.set(event.player.position.x, event.player.position.y, undefined, undefined, false, true);
			}
		});
		
		//affichage des PV et du TOP
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

		//gere les degats des pieges
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
}
*/
export {};
