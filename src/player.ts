import { WorkadventurePlayerCommands } from "@workadventure/iframe-api-typings/front/Api/Iframe/player";
import { callbackify } from "util";

class Player {
  static async initPlayerVariables(
    player: WorkadventurePlayerCommands
  ): Promise<void> {
    await player.state.saveVariable("lifePoint", 3, {
      public: false,
      persist: false,
      scope: "room",
    });

    console.log(`Initialized Player: ${player}`);
  }

  static async onLifePointEqualsZero(
    player: WorkadventurePlayerCommands,
    callback: Function
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


}

export default Player;
