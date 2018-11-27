import * as debug from "debug"
import * as Phaser from "phaser"

import UnifiedController from "../GameInput"
import { Assets } from "../assets"
import { Levels } from "../levels"

import { Scenes } from "./"
import { IGameInitialization } from "./Game"

const log = debug(`game:scenes:${Scenes.LevelComplete}`)

export default class LevelComplete extends Phaser.Scene {
    private config: IGameInitialization
    private controller: UnifiedController

    constructor() {
        super({
            key: Scenes.LevelComplete
        })

        log("constructed")
    }

    public create(config: IGameInitialization) {
        log("create")

        this.config = config
        this.controller = new UnifiedController(this.input)

        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.6).setOrigin(0, 0)

        const container = this.add.container(100, 100)
        container.add(this.add.image(0, 0, Assets.LevelStartBackground).setOrigin(0, 0))
        container.add(
            this.add
                .text(400, 90, `LEVEL ${config.level}`, {
                    fill: "#ffffff",
                    font: "48px Righteous"
                })
                .setAlign("center")
                .setOrigin(0.5)
        )

        container.add(
            this.add
                .text(400, 200, `COMPLETE`, {
                    fill: "#00AA00",
                    font: "72px Righteous"
                })
                .setAlign("center")
                .setOrigin(0.5)
        )

        const buttonContainer = this.add.container(500, 620)
        const begin = this.add.image(0, 0, Assets.ButtonBackground).setInteractive()
        begin.once("pointerup", this.onClick, this)
        buttonContainer.add(begin)
        buttonContainer.add(
            this.add.text(0, 0, "NEXT", { fill: "#ffffff", font: "48px Share Tech Mono" }).setOrigin(0.5)
        )
    }

    private onClick() {
        this.cameras.main.fade(500, 0, 0, 0, true)
        this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.stop(Scenes.Game)
            this.scene.stop(Scenes.GameUI)

            const next = this.config.level + 1
            if (!Levels[next]) {
                this.scene.start(Scenes.Winner)
            } else {
                this.scene.start(Scenes.Game, Object.assign({}, this.config, { level: next }))
            }
        })
    }
}
