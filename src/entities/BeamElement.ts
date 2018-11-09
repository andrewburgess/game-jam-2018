import * as debug from "debug"
import * as Phaser from "phaser"

import { Beam } from "./Beam"

export const BEAM_ELEMENT_WIDTH = 20
export const BEAM_ELEMENT_HEIGHT = 30

const log = debug("game:entities:BeamElement")

export class BeamElement extends Phaser.GameObjects.Rectangle {
    public beam: Beam
    public body: Phaser.Physics.Arcade.Body

    private color: Phaser.Display.Color

    constructor(beam: Beam, x: number, y: number, color: string | Phaser.Display.Color = "#ffffff") {
        log("constructing")

        super(beam.scene, x, y, BEAM_ELEMENT_WIDTH, BEAM_ELEMENT_HEIGHT)

        this.beam = beam

        this.color = typeof color === "string" ? Phaser.Display.Color.HexStringToColor(color) : color

        this.setFillStyle(this.color.color, 1)
        this.isFilled = true

        this.setStrokeStyle(1, this.color.clone().darken(50).color)
        this.isStroked = true

        this.type = "BeamElement"

        log("constructed")
    }

    public update() {
        log("updating")

        if (this.body.touching) {
            log(`touching: ${this.body.touching}`)
        }

        log("updated")
    }
}
