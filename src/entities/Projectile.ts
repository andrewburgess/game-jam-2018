import * as debug from "debug"
import * as Phaser from "phaser"

import { Assets } from "../assets"

import { Piece, RotateDirection } from "./Piece"

const log = debug("game:entities:Projectile")

export class Projectile extends Phaser.Physics.Arcade.Sprite {
    private hasHit: boolean

    constructor(scene: Phaser.Scene, x: number, y: number) {
        log("constructing")

        super(scene, x, y, Assets.Projectile)

        this.hasHit = false

        this.scene.physics.world.enable(this)
        this.scene.add.existing(this)

        log("constructed")
    }

    public update(time: number, delta: number, currentPiece: Piece) {
        // NOTE(tristan): may need to rework this if we ever want more than one piece on the board
        if (this.hasHit) {
            return
        }

        const piecePY = currentPiece.y - currentPiece.height
        const piecePLeft = currentPiece.x - currentPiece.width / 2
        const piecePRight = currentPiece.x + currentPiece.width / 2

        if (this.body.hitTest(piecePLeft, piecePY)) {
            currentPiece.rotate(RotateDirection.CLOCKWISE)
            this.hasHit = true
        } else if (this.body.hitTest(piecePRight, piecePY)) {
            currentPiece.rotate(RotateDirection.COUNTER_CLOCKWISE)
            this.hasHit = true
        }
    }
}
