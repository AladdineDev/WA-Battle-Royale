import {WorkadventurePlayerCommands} from "@workadventure/iframe-api-typings/front/Api/Iframe/player";


/**
 * @param : Current player
 * */
export function decreasePlayerLives( player: WorkadventurePlayerCommands) {
    let val   = player.state.loadVariable('vie') as number
    val  = val-1
    player.state.saveVariable('vie', val)
    return WA.player.state.vie
}
