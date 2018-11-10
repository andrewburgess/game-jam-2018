import * as debug from "debug"
import * as Phaser from "phaser"

import { BEAM_ELEMENT_HEIGHT, BEAM_ELEMENT_WIDTH, BeamElement } from "./BeamElement"
import { Block } from "./Block"
import { Piece } from "./Piece"

const log = debug("game:entities:Beam")

export class Beam extends Phaser.GameObjects.Container {
    public elements: Phaser.Physics.Arcade.Group
    public delta: number
    public latched: boolean
    public scene: Phaser.Scene
    private beamTop: BeamElement
    private latchedTo: Piece

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

    public update(time: number, delta: number) {
        this.delta += delta

        // TODO(tristan): maybe give piece ship velocity if let go in mid-space?
        if (this.delta > 100.0) {
            if (this.latched) {
                this.retractBeam()
            } else {
                this.extendBeam()
            }
            this.delta = 0.0
        }

        if (this.latched) {
            const latchAlignOffsetX: number = this.x - this.latchedTo.width / 2 + BEAM_ELEMENT_WIDTH / 2
            const latchAlignOffsetY: number = this.y - this.height - this.latchedTo.height / 2 - BEAM_ELEMENT_HEIGHT / 2
            this.latchedTo.setPosition(latchAlignOffsetX, latchAlignOffsetY)
        }
    }

    public addPieceLatchChecks(piece: Piece) {
        this.scene.physics.add.overlap(
            this.elements,
            piece.blocks,
            (beamElem: BeamElement, pieceBlock: Block) => {
                pieceBlock.piece.setPosition(beamElem.x, beamElem.y)
                pieceBlock.piece.setScale(1.25)
                this.latched = true
                this.latchedTo = piece
            },
            undefined,
            this
        )
    }

    private extendBeam() {
        const beamElem: BeamElement = new BeamElement(
            this,
            0,
            -BEAM_ELEMENT_HEIGHT * this.elements.getLength(),
            new Phaser.Display.Color(
                Phaser.Math.Between(0, 150),
                Phaser.Math.Between(0, 75),
                Phaser.Math.Between(125, 255)
            )
        )

        this.beamTop = beamElem

        if (this.length === 0) {
            // TODO(tristan): https://answers.unity.com/questions/760532/how-to-warpdistort-a-2d-sprite.html
            // Warp initial beam element into cone-ish shape to look like the beam is coming out of the ship
        }

        this.add(beamElem)
        this.setSize(BEAM_ELEMENT_WIDTH, BEAM_ELEMENT_HEIGHT * this.length)

        this.elements.add(beamElem)
        beamElem.body.setAllowGravity(false)

        this.delta = 0.0
    }

    private retractBeam() {
        if (this.length >= 5) {
            this.remove(this.beamTop)
            this.beamTop = this.getAt(this.length - 1) as BeamElement
            this.setSize(BEAM_ELEMENT_WIDTH, BEAM_ELEMENT_HEIGHT * this.length)
            this.elements.clear()
            this.elements.add(this.beamTop)
            this.beamTop.body.setAllowGravity(false)
        }
    }
}
