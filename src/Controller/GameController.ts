import { Tile } from "../Entity/Tile";
import { Position } from "../Entity/Position";

export function initTimerGame(
	timeCounter: number,
	numberTileLimit: number,
	tic: number,
	mapConfig: any
) {
	setInterval(() => {
		timeCounter -= 10;
		if (timeCounter <= 300) {
			handleTileRemovedByTime(numberTileLimit, tic, mapConfig);
		}
		numberTileLimit;
	}, 10000); // 10 seconds
}

export function handleTileRemovedByTime(
	numberTileLimit: number,
	tic: number,
	mapConfig: any
) {
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
				if (isNotInSafeZone(i, j, numberTileLimit, mapConfig)) {
					line.push(new Tile(j, i, "uglyblue", "EndGameTiles"));
					line.push(new Tile(j, i, "collision", "collisions"));
				}
			}
		}
		tileToModify.push(line);
		//WA.room.setTiles(line);
	}
	tic++;
}

export function isNotInSafeZone(
	height: number,
	width: number,
	numberTileLimit: number,
	mapConfig: any
) {
	const safeZoneCoordinates = {
		heightMin: mapConfig.height / 2 - numberTileLimit,
		heightMax: mapConfig.height / 2 + numberTileLimit,
		widthMin: mapConfig.width / 2 - numberTileLimit,
		widthMax: mapConfig.width / 2 + numberTileLimit,
	};
	return !(
		width < 12 ||
		(height > safeZoneCoordinates.heightMin &&
			height < safeZoneCoordinates.heightMax &&
			width > safeZoneCoordinates.widthMin &&
			width < safeZoneCoordinates.widthMax)
	);
}

function GetItemSpawnLocation(map: any) {
	const spawnLocationLayer = map.layers[0];
	let itemsLocations: Position[] = [];
	for (let i = 0; i < spawnLocationLayer.data.length; i++) {
		if (spawnLocationLayer.data[i] !== 0) {
			itemsLocations.push(
				new Position(
					i % spawnLocationLayer.width,
					Math.floor(i / spawnLocationLayer.width)
				)
			);
		}
	}
	console.log("itemsLocation", itemsLocations);

	return itemsLocations;
}

function spawnItem(itemsLocation: Position[]) {
	let itemList = [];
	for (let i = 0; i < itemsLocation.length; i++) {
		itemList.push(
			new Tile(itemsLocation[i].x, itemsLocation[i].y, "TestItem", "items")
		);
		console.log("itemList", itemList);
	}
	WA.room.setTiles(itemList);
}

export async function GenerateItems(map: any) {
	console.log("Generating items");
	console.log("map", map);
	const itemsLocation = GetItemSpawnLocation(map);
	spawnItem(itemsLocation);
	console.log("items generated");
}
