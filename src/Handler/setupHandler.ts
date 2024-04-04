import { Tile } from "../Entity/Tile";

export class SetupHandler {
	_instance: SetupHandler | null = null;
	map: any = undefined;
	mapConfig = { height: 0, width: 0 };
	timeCounter = 300; // 5 minutes
	numberTileLimit = 3;
	tic = 0;
	numberOfParticipantsNeededToLaunchTheGame = 2;

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
		await WA.players.configureTracking();


		this.initTimerGame(this.timeCounter);
		//Initially, the player is not waiting to play
		WA.player.state.saveVariable("IsInWaitingRoom", false, {
			public: true,
			persist: true,
			ttl: 24 * 3600,
			scope: "world",
		});

		WA.room.area.onEnter("WaitingRoom").subscribe(() => {
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

		//test if it works
		WA.players.onVariableChange("IsInWaitingRoom").subscribe((event) => {
			console.log(`Player ${event.player.name} new status is ${event.value}`);
		});

		WA.state.onVariableChange("gameLaunched").subscribe((value) => {
			console.log("value = " + value);
			if(WA.player.state.IsInWaitingRoom && value){
				WA.player.teleport(1284, 549);
			}
		});
	}

	initTimerGame(timeCounter: number) {
		setInterval(() => {
			timeCounter -= 10;
			if (timeCounter <= 300) {
				this.handleTileRemovedByTime();
			}
			this.numberTileLimit;
		}, 10000); // 10 seconds
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
						line.push(new Tile(j, i, "uglyblue", "above/above3"));
						//line.push(new Tile(j, i, "collision", "collisions"));
					}
				}
			}
			tileToModify.push(line);
			WA.room.setTiles(line);
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
			height > safeZoneCoordinates.heightMin &&
			height < safeZoneCoordinates.heightMax &&
			width > safeZoneCoordinates.widthMin &&
			width < safeZoneCoordinates.widthMax
		);
	}

	async checkIfEnoughPlayersToLaunchTheGame() {
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
			console.log("Game is launched");
			WA.state.gameLaunched = true;
		}
	}
}
