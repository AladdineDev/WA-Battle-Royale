export class Tile {
	x: number;
	y: number;
	tile: string;
	layer: string;
	shouldDamagePlayer: boolean;
	constructor(x: number, y: number, tile: string, layer: string) {
		this.x = x;
		this.y = y;
		this.tile = tile;
		this.layer = layer;
		this.shouldDamagePlayer = false;
	}

	toJSON() {
		return JSON.stringify(this);
	}
}
