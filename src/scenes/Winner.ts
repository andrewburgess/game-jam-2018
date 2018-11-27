import * as debug from "debug"
import * as Phaser from "phaser"

import { Assets } from "../assets"

import { Scenes } from "./"

const log = debug(`game:scenes:${Scenes.LevelComplete}`)

export default class Winner extends Phaser.Scene {
    constructor() {
        super({
            key: Scenes.Winner
        })

        log("constructed")
    }

    public create() {
        log("create")

        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.6).setOrigin(0, 0)

        const container = this.add.container(100, 100)
        container.add(this.add.image(0, 0, Assets.LevelStartBackground).setOrigin(0, 0))
        container.add(
            this.add
                .text(400, 90, "YOU WIN", {
                    fill: "#ffffff",
                    font: "64px Righteous"
                })
                .setAlign("center")
                .setOrigin(0.5)
        )

        container.add(
            this.add
                .text(400, 200, `CONGRATS I GUESS`, {
                    fill: "#00AA00",
                    font: "48px Righteous"
                })
                .setAlign("center")
                .setOrigin(0.5)
        )

        container.add(
            this.add.text(400, 500, "¯\\_(ツ)_/¯", { fill: "#ffffff", font: "48px monospace" }).setOrigin(0.5)
        )
    }
}
