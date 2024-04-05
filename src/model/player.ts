
import { WorkadventurePlayerCommands } from "@workadventure/iframe-api-typings/play/src/front/Api/Iframe/player";
import { Item } from "./item";
import { Inventory } from "./inventory";
import { Position } from "../Entity/Position";
import { Tile } from "../Entity/Tile";
import { updateBanner } from "../main";

export class Player {
  static async initPlayerVariables(
    player: WorkadventurePlayerCommands
  ): Promise<void> {

    // Add LifePoint player variable
    await player.state.saveVariable("lifePoint", 3, {
      public: false,
      persist: false,
      scope: "room",
    });

    // Add LifePoint player variable
    await player.state.saveVariable("inventory", new Inventory(), {
      public: false,
      persist: false,
      scope: "room",
    });

    console.log(`Initialized Player: ${player}`);
    console.log(`Initialized Player Inventory: ${(player.state.inventory as Inventory).toString()}`);
  }

  static async onLifePointEqualsZero(
    player: WorkadventurePlayerCommands,
    callback: () => void
  ): Promise<void> {
    const subscription = player.state
      .onVariableChange("lifePoint")
      .subscribe((lifePoint) => {
        if (lifePoint == 0) {
          callback();
          console.log("Player is dead. Player Life Point: ", lifePoint);
          subscription.unsubscribe();
        }
      });
  }

  static async updateLifePoint(
    player: WorkadventurePlayerCommands,
    lifePoint: number
  ): Promise<void> {
    WA.player.state.lifePoint = lifePoint
    console.log(`Update Player Life Point: ${player}`);
  }

  static async addItemToInventory(
    player: WorkadventurePlayerCommands,
    item: Item
  ): Promise<void> {
    let inventory = (player.state.inventory as Inventory)
    WA.player.state.inventory = [...inventory.items, item]
    console.log(`Update Player Inventory: ${player}`);
  }

  static async removeItemToInventory(
    player: WorkadventurePlayerCommands,
    item: Item
  ): Promise<void> {
    const inventory = player.state.inventory as Inventory;
    const items = inventory.items;
    const index = items.findIndex(i => i.value === item.value);
    if (index !== -1) {
      inventory.items.splice(index, 1);
      console.log(`Item removed from inventory: ${item.value}`);
    } else {
      console.log(`Item not found in inventory: ${item.value}`);
    }
  }

  static async initFetchItemsOnMove() {
    const TILE_SIZE = 32;
    WA.player.onPlayerMove(async ({ x, y }) => {
      const items = WA.state.loadVariable("generatedItems") as Item[];

      for (const item of items) {
        const userTileCoordinates = { x: Math.floor(x / TILE_SIZE), y: Math.floor(y / TILE_SIZE) };
        if (item.tile?.x === userTileCoordinates.x && item.tile?.y === userTileCoordinates.y) {
          WA.room.setTiles([{ layer: "items", tile: null, x: item.tile.x, y: item.tile.y }]);
          item.tile = undefined;
          await Player.addItemToInventory(WA.player, item);
          const otherItems = items.filter(e => e !== item);
          WA.state.saveVariable("generatedItems", otherItems);
          updateBanner();
          console.debug(`Player ${WA.player.name} found item ${item.value}`);
        }
      }
    });
  }

}
