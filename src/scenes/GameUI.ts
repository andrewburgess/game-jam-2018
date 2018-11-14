import * as debug from "debug"
import * as Phaser from "phaser"

import { ILevel, Levels } from "../levels"

import { Scenes } from "./"
import { IGameInitialization } from "./Game"

const log = debug(`game:scenes:${Scenes.GameUI}`)

export default class GameUI extends Phaser.Scene {
    private level: ILevel

    constructor() {
        super({
            key: Scenes.GameUI
        })

        log("constructed")
    }

    public create(config: IGameInitialization) {
        log("create")

        this.level = Levels[config.level]
    }
}
