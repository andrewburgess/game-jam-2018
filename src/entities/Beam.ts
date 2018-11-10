import * as debug from "debug"
import { each } from "lodash"
import * as Phaser from "phaser"

import { BEAM_ELEMENT_HEIGHT, BEAM_ELEMENT_WIDTH, BeamElement } from "./BeamElement"
import { Block } from "./Block"
import { Piece } from "./Piece"

const log = debug("game:entities:Beam")

export class Beam extends Phaser.GameObjects.Container {
    public elements: Phaser.Physics.Arcade.Group
    public delta: number
    public scene: Phaser.Scene
    private beamTop: BeamElement
    private latched: boolean

    constructor(scene: Phaser.Scene, x: number, y: number) {
        log("constructing")

        super(scene, x, y)
        this.scene = scene
        this.delta = 0.0
        this.elements = new Phaser.Physics.Arcade.Group(this.scene.physics.world, this.scene)
        this.scene.add.existing(this)

        log("constructed")
    }

    public getElements(): BeamElement[] {
        return this.getAll() as BeamElement[]
    }

    public setGravity(enabled: boolean) {
        each(this.getElements(), (element) => element.body.setAllowGravity(enabled))
    }

    public update(time: number, delta: number) {
        this.delta += delta

        if (this.latched) {
            // TODO(tristan): impl periodic update of removing beam elements and updating current piece position towards the player
        } else if (this.delta > 100.0) {
            const beamElem: BeamElement = new BeamElement(
                this,
                0,
                -BEAM_ELEMENT_HEIGHT * this.elements.getLength(),
                new Phaser.Display.Color(
                    Phaser.Math.Between(125, 255),
                    Phaser.Math.Between(125, 255),
                    Phaser.Math.Between(125, 255)
                )
            )

            this.beamTop = beamElem

            this.add(beamElem)
            this.setSize(BEAM_ELEMENT_WIDTH, BEAM_ELEMENT_HEIGHT * this.elements.getLength())

            this.elements.add(beamElem)
            this.setGravity(false)

            this.delta = 0.0
        }
    }

    public addPieceLatchChecks(piece: Piece) {
        this.scene.physics.add.overlap(
            this.elements,
            piece.blocks,
            (beamElem: BeamElement, pieceBlock: Block) => {
                // TODO(tristan): setting position currently won't work like this because the piece will collide with all elements of the beam. fix.
                // pieceBlock.piece.setPosition(beamElem.x, beamElem.y)
                pieceBlock.piece.setScale(1.25)
                this.latched = true
            },
            undefined,
            this
        )
    }
}
