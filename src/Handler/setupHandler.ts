import { Tile } from "../Entity/Tile";
import { Player } from "../model/player";

export class SetupHandler {
	_instance: SetupHandler | null = null;
	map: any = undefined;
	mapMatrice: Tile[][] = [];
	mapConfig = { height: 0, width: 0 };
	timeCounter = 300; // 5 minutes
	numberTileLimit = 3;
	tic = 0;
	numberOfParticipantsNeededToLaunchTheGame = 2;
	hasAlreadyTakenDamage = false;

	constructor() {
		if (this._instance) {
			return this._instance;
		}
		this._instance = this;
	}

	async init() {
		this.map = await WA.room.getTiledMap();
		this.mapConfig.height = this.map.height ?? 0;
		this.mapConfig.width = this.map.width ?? 0;
		this.loadingMap();
		await WA.players.configureTracking();

		this.initTimerGame(this.timeCounter);
		//Initially, the player is not waiting to play
		WA.player.state.saveVariable("IsInWaitingRoom", false, {
			public: true,
			persist: true,
			ttl: 24 * 3600,
			scope: "world",
		});
		
		WA.player.state.saveVariable("gameLaunched", false, {
			public: true,
			persist: true,
			ttl: 24 * 3600,
			scope: "world",
		});

		WA.room.area.onEnter("WaitingRoom").subscribe(() => {

			/*let config = WA.state.loadVariable('Config');
			console.log('Config', typeof config);

			((config as any).Players as any[]).push(WA.player);

			WA.player.state.saveVariable("Players", config, {
				public: true,
				persist: true,
				ttl: 24 * 3600,
				scope: "world",
			});

			console.log('Config after ', config);*/

			WA.player.state.saveVariable("IsInWaitingRoom", true, {
				public: true,
				persist: true,
				ttl: 24 * 3600,
				scope: "world",
			});

			this.checkIfEnoughPlayersToLaunchTheGame();
			console.log("Player is in waiting room");
		});

		WA.room.area.onLeave("WaitingRoom").subscribe(() => {
			
			WA.player.state.saveVariable("IsInWaitingRoom", false, {
				public: true,
				persist: true,
				ttl: 24 * 3600,
				scope: "world",
			});
			console.log("Player left waiting room");
		});

		//Check every 3 seconds if the player is on a tile that should damage him
		setInterval(async () => {
			const position = await WA.player.getPosition();
			let horizontalTile = Math.floor(position.x / 32);
			let verticalTile = Math.floor(position.y / 32);
			if (this.mapMatrice[verticalTile][horizontalTile].shouldDamagePlayer) {
				if (!this.hasAlreadyTakenDamage) {
					this.hasAlreadyTakenDamage = true;
					Player.updateLifePoint(
						WA.player,
						(WA.player.state.lifePoint as number) - 1
					);
					setTimeout(() => {
						this.hasAlreadyTakenDamage = false;
					}, 3000);
				}
			}
		}, 3000);

		//test if it works
		WA.players.onVariableChange("IsInWaitingRoom").subscribe((event) => {
			console.log(`Player ${event.player.name} new status is ${event.value}`);
		});

		WA.state.onVariableChange("gameLaunched").subscribe((value) => {
			console.log("value = " + value);
			if (WA.player.state.IsInWaitingRoom && value) {
				WA.player.teleport(1284, 549);
			}
		});
	}

	loadingMap() {
		for (let i = 0; i < this.mapConfig.height; i++) {
			const line: Tile[] = [];
			for (let j = 0; j < this.mapConfig.width; j++) {
				//line.push(new Tile(j, i, "uglyblue", "EndGameTiles"));
			}
			this.mapMatrice.push(line);
		}
	}

	initTimerGame(timeCounter: number) {
		setInterval(() => {
			timeCounter -= 10;
			if (timeCounter <= 300) {
				this.handleTileRemovedByTime();
			}
			this.numberTileLimit;
		}, 3000); // 3 seconds
	}

	handleTileRemovedByTime() {
		const tileToModify = [];
		for (let i = 0; i < this.mapConfig.height; i++) {
			const line = [];
			for (let j = 0; j < this.mapConfig.width; j++) {
				if (
					i == this.tic ||
					i == this.mapConfig.height - this.tic ||
					j == this.tic ||
					j == this.mapConfig.width - this.tic
				) {
					if (this.isNotInSafeZone(i, j, this.numberTileLimit)) {
						line.push(new Tile(j, i, "uglyblue", "EndGameTiles"));
						this.mapMatrice[i][j].shouldDamagePlayer = true;
					}
				}
			}
			tileToModify.push(line);
			//WA.room.setTiles(line);
		}
		this.tic++;
	}

	isNotInSafeZone(height: number, width: number, numberTileLimit: number) {
		const safeZoneCoordinates = {
			heightMin: this.mapConfig.height / 2 - numberTileLimit,
			heightMax: this.mapConfig.height / 2 + numberTileLimit,
			widthMin: this.mapConfig.width / 2 - numberTileLimit,
			widthMax: this.mapConfig.width / 2 + numberTileLimit,
		};
		return !(
			width < 12 ||
			(height > safeZoneCoordinates.heightMin &&
				height < safeZoneCoordinates.heightMax &&
				width > safeZoneCoordinates.widthMin &&
				width < safeZoneCoordinates.widthMax)
		);
	}

	checkIfEnoughPlayersToLaunchTheGame() {
		let players = WA.players.list();
		let playersArray = Array.from(players);
		let finalPlayers = playersArray.filter(
			(player) => player.state.IsInWaitingRoom
		);

		console.log(finalPlayers);
		if (
			finalPlayers.length >=
			this.numberOfParticipantsNeededToLaunchTheGame - 1
		) {
			WA.state.gameLaunched = true;
		}
	}
}
