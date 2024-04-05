import { ItemList } from "../Entity/ItemList";
import { Tile } from "../Entity/Tile";

export class Item {
    value: ItemList
    tile?: Tile

    constructor(value: ItemList, tile?: Tile) {
        this.value = value;
        this.tile = tile;
    }
}