import * as Phaser from "phaser"

import Game from "./scenes/Game"
import GameSettings from "./scenes/GameSettings"
import GameUI from "./scenes/GameUI"
import Loading from "./scenes/Loading"
import Menu from "./scenes/Menu"

const GameConfiguration: GameConfig = {
    // TODO(tristan): determine if this is fine to leave in; test on multiple browsers
    // Otherwise, will need Firefox-specific check to work around audio display update issues.
    audio: {
        disableWebAudio: true
    },
    backgroundColor: "#000000",
    height: 800,
    input: {
        gamepad: true
    },
    scene: [Loading, Menu, Game, GameSettings, GameUI],
    width: 1000
}

const start = () => new Phaser.Game(GameConfiguration)

window.WebFont.load({
    active: () => start(),
    google: {
        families: ["Righteous"]
    },
    inactive: () => start(),
    timeout: 2000
})
