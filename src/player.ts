
import { WorkadventurePlayerCommands } from "@workadventure/iframe-api-typings/play/src/front/Api/Iframe/player";
import Inventory from "./model/inventory";
import Item from "./model/item";

class Player {
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
    const subscription = await player.state
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
    var inventory = (player.state.inventory as Inventory)
    WA.player.state.inventory = [...inventory.items, item] 
    console.log(`Update Player Inventory: ${player}`);
  }

  static async removeItemToInventory(
    player: WorkadventurePlayerCommands,
    item: Item
  ): Promise<void> {
    const inventory = player.state.inventory as Inventory;
    const items = inventory.items;
    const index = items.findIndex(i => i.name === item.name);
    if (index !== -1) {
      inventory.items.splice(index, 1);
      console.log(`Item removed from inventory: ${item.name}`);
    } else {
      console.log(`Item not found in inventory: ${item.name}`);
    }
  }

}

export default Player;
