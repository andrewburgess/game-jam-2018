import * as debug from "debug"
import * as Phaser from "phaser"

import UnifiedController from "../GameInput"
import { Assets } from "../assets"

import { Scenes } from "./"
import { IGameInitialization } from "./Game"

const log = debug(`game:scenes:${Scenes.LevelFail}`)

export default class LevelFail extends Phaser.Scene {
    private clicked: boolean
    private config: IGameInitialization
    private controller: UnifiedController

    constructor() {
        super({
            key: Scenes.LevelFail
        })

        log("constructed")
    }

    public create(config: IGameInitialization) {
        log("create")

        this.clicked = false

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
                .text(400, 200, `FAILED`, {
                    fill: "#AA0000",
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
            this.add.text(0, 0, "RETRY", { fill: "#ffffff", font: "48px Share Tech Mono" }).setOrigin(0.5)
        )
    }

    public update(time: number, delta: number) {
        if (!this.scene.isActive(Scenes.LevelComplete)) {
            return
        }

        super.update(time, delta)

        if (!this.clicked && (this.controller.actionA!.isDown() || this.controller.enter!.isDown())) {
            this.onClick()
        }
    }

    private onClick() {
        this.clicked = true
        this.cameras.main.fade(500, 0, 0, 0, true)
        this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.stop(Scenes.Game)
            this.scene.stop(Scenes.GameUI)
            this.scene.start(Scenes.Game, this.config)
        })
    }
}
