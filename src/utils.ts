import { WorkadventurePlayerCommands } from "@workadventure/iframe-api-typings/play/src/front/Api/Iframe/player"


/**
 * @param : Current player
 * */
export function decreasePlayerLives( player: WorkadventurePlayerCommands) {
    let val   = player.state.loadVariable('vie') as number
    val  = val-1
    player.state.saveVariable('vie', val)
    return WA.player.state.vie
}

export function increasePlayerLives(player: WorkadventurePlayerCommands){
    let val   = player.state.loadVariable('vie') as number
    val  = val +1
    player.state.saveVariable('vie', val)
    return WA.player.state.vie
}


