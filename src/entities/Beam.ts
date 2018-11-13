import * as debug from "debug"
import * as Phaser from "phaser"

import { BLOCK_SIZE } from "./Block"
import { Piece } from "./Piece"
import { Player } from "./Player"

const log = debug("game:entities:Beam")

const BEAM_RESOURCES_TEXT = "Beam Resources: "
const BEAM_RESOURCE_GEN_DELTA = 500.0
const BEAM_UPDATE_DELTA = 100.0

export class Beam extends Phaser.GameObjects.Sprite {
    public scene: Phaser.Scene
    private player: Player
    private resourceGenDelta: number
    private resourceLimit: number
    private resources: number
    private resourcesText: Phaser.GameObjects.Text
    private updateDelta: number

    constructor(scene: Phaser.Scene, player: Player, startingResources: number) {
        log("constructing")

        const x: number = player.x - player.width + 15
        const y: number = player.y - player.height
        // TODO(tristan): make semi-transparent blue cone sprite texture to represent the beam
        super(scene, x, y, "")
        this.scene = scene

        this.player = player
        this.resourceGenDelta = BEAM_RESOURCE_GEN_DELTA
        this.resources = this.resourceLimit = startingResources
        this.resourcesText = this.scene.add.text(
            this.scene.cameras.main.width - 200,
            5,
            BEAM_RESOURCES_TEXT + this.resources
        )
        this.updateDelta = 0.0

        this.scene.add.existing(this)

        log("constructed")
    }

    public update(time: number, delta: number, currentPiece: Piece) {
        this.updateDelta += delta
        this.resourceGenDelta += delta

        if (this.resourceGenDelta > BEAM_RESOURCE_GEN_DELTA) {
            this.resources = Math.min(this.resources + 1, this.resourceLimit)
            this.resourceGenDelta = 0
        }

        this.updateBeamPosition()

        if (this.updateDelta > BEAM_UPDATE_DELTA) {
            if (this.canPull(currentPiece)) {
                this.pull(currentPiece)
            } else {
                this.resources--
            }
            this.updateDelta = 0.0
        }

        this.resourcesText.text = BEAM_RESOURCES_TEXT + this.resources
    }

    private canPull(piece: Piece): boolean {
        if (piece && (this.x >= piece.x && this.x <= piece.x + piece.width)) {
            return true
            // TODO(tristan): https://answers.unity.com/questions/760532/how-to-warpdistort-a-2d-sprite.html
            // Warp space in front of beam into cone-ish shape to look like the beam is coming out of the ship
        } else {
            return false
        }
    }

    private pull(piece: Piece) {
        piece.setX(this.x - piece.width / 2)
        piece.setY(piece.y + BLOCK_SIZE)
    }

    private updateBeamPosition() {
        const beamPosX: number = this.player.x - this.player.width + 15
        const beamPosY: number = this.player.y - this.player.height
        this.setPosition(beamPosX, beamPosY)
    }
}
