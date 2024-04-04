import { WorkadventurePlayerCommands } from "@workadventure/iframe-api-typings/front/Api/Iframe/player";

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

  static async listenPlayerLife(
    player: WorkadventurePlayerCommands
  ): Promise<void> {
    const subscription = await player.state
      .onVariableChange("lifePoint")
      .subscribe((lifePoint) => {
        if (lifePoint == 0) {
          console.log("Player is dead. Player Life Point: ", lifePoint);
          subscription.unsubscribe();
        }
      });
  }
}

export default Player;
