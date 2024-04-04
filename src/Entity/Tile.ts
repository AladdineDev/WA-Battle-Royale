export class Tile {
	x: number;
	y: number;
	tile: string;
	layer: string;
	constructor(x: number, y: number, tile: string, layer: string) {
		this.x = x;
		this.y = y;
		this.tile = tile;
		this.layer = layer;
	}

	toJSON() {
		return JSON.stringify(this);
	}
}
