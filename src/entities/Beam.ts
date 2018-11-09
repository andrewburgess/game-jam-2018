import * as debug from "debug"
import { each } from "lodash"
import * as Phaser from "phaser"

import { BEAM_ELEMENT_HEIGHT, BEAM_ELEMENT_WIDTH, BeamElement } from "./BeamElement"

const log = debug("game:entities:Beam")

export class Beam extends Phaser.GameObjects.Container {
    public elements: Phaser.Physics.Arcade.Group
    public delta: number

    constructor(scene: Phaser.Scene, x: number, y: number) {
        log("constructing")

        super(scene, x, y)

        this.add(
            new BeamElement(
                this,
                0,
                0,
                new Phaser.Display.Color(
                    Phaser.Math.Between(125, 255),
                    Phaser.Math.Between(125, 255),
                    Phaser.Math.Between(125, 255)
                )
            )
        )
        this.setSize(BEAM_ELEMENT_WIDTH, BEAM_ELEMENT_HEIGHT)

        this.delta = 0.0

        this.setupPhysics()

        this.scene.add.existing(this)

        log("constructed")
    }

    public getElements(): BeamElement[] {
        return this.getAll() as BeamElement[]
    }

    public setGravity(enabled: boolean) {
        each(this.getElements(), (element) => element.body.setAllowGravity(enabled))
    }

    public setupPhysics() {
        this.elements = new Phaser.Physics.Arcade.Group(this.scene.physics.world, this.scene)
        this.elements.addMultiple(this.getElements())
        this.setGravity(false)
    }

    public update(time: number, delta: number) {
        this.delta += delta

        if (this.delta > 100.0) {
            this.add(
                new BeamElement(
                    this,
                    0,
                    -BEAM_ELEMENT_HEIGHT * this.elements.getLength(),
                    new Phaser.Display.Color(
                        Phaser.Math.Between(125, 255),
                        Phaser.Math.Between(125, 255),
                        Phaser.Math.Between(125, 255)
                    )
                )
            )
            this.setSize(BEAM_ELEMENT_WIDTH, BEAM_ELEMENT_HEIGHT * this.elements.getLength())
            this.setupPhysics()
            this.delta = 0.0
        }
    }
}
