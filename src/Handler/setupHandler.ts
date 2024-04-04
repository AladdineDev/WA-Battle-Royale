export class SetupHandler {
	_instance: SetupHandler | null = null;
	map: any = undefined;
	mapConfig = { height: 0, width: 0 };

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
	}
}
