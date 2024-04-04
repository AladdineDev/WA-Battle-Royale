/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import { Tile } from "./Entity/Tile";

console.log("Script started successfully");

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

		initTimerGame(timeCounter);

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

function initTimerGame(timeCounter: number) {
	setInterval(() => {
		timeCounter -= 10;
		if (timeCounter <= 300) {
			handleTileRemovedByTime();
		}
		numberTileLimit;
	}, 10000); // 10 seconds
}

function handleTileRemovedByTime() {
	const tileToModify = [];
	for (let i = 0; i < mapConfig.height; i++) {
		const line = [];
		for (let j = 0; j < mapConfig.width; j++) {
			if (
				i == tic ||
				i == mapConfig.height - tic ||
				j == tic ||
				j == mapConfig.width - tic
			) {
				if (isNotInSafeZone(i, j, numberTileLimit)) {
					line.push(new Tile(j, i, "uglyBlue", "above/laptops"));
					//line.push(new Tile(j, i, "collision", "collisions"));
				}
			}
		}
		tileToModify.push(line);
		WA.room.setTiles(line);
	}
	tic++;
}

function isNotInSafeZone(
	height: number,
	width: number,
	numberTileLimit: number
) {
	const safeZoneCoordinates = {
		heightMin: mapConfig.height / 2 - numberTileLimit,
		heightMax: mapConfig.height / 2 + numberTileLimit,
		widthMin: mapConfig.width / 2 - numberTileLimit,
		widthMax: mapConfig.width / 2 + numberTileLimit,
	};
	return !(
		height > safeZoneCoordinates.heightMin &&
		height < safeZoneCoordinates.heightMax &&
		width > safeZoneCoordinates.widthMin &&
		width < safeZoneCoordinates.widthMax
	);
}

export {};
