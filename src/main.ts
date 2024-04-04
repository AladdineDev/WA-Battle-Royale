/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import {initTimerGame, GenerateItems} from "./Controller/GameController";

console.log('Script started successfully');

let currentPopup: any = undefined;
let timeCounter = 300; // 5 minutes
let map: any = undefined;
const mapConfig = { height: 0, width: 0 };
const numberTileLimit = 3;
let tic = 0;

// Waiting for the API to be ready
WA.onInit()
	.then(async () => {
		console.log("Scripting API ready");
		console.log("Player tags: ", WA.player.tags);
		map = await WA.room.getTiledMap();
		console.log(map);
		mapConfig.height = map.height ?? 0;
		mapConfig.width = map.width ?? 0;
        await GenerateItems(map);
		initTimerGame(timeCounter, numberTileLimit, tic, mapConfig);

		let movementConfig = true;
		let playersConfig = true;
		await WA.players.configureTracking({
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

		WA.room.area.onEnter("clock").subscribe(() => {
			const today = new Date();
			const time = today.getHours() + ":" + today.getMinutes();
			currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
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

export {};
