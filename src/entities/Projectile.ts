import * as debug from "debug"
import * as Phaser from "phaser"

import { Assets } from "../assets"
import Game from "../scenes/Game"

import { Piece, RotateDirection } from "./Piece"

const log = debug("game:entities:Projectile")

const PROJECTILE_COLLISION_BOUND_SCALE_X = 0.5

export class Projectile extends Phaser.Physics.Arcade.Sprite {
    private hasHit: boolean
    private game: Game

    constructor(game: Game, x: number, y: number) {
        log("constructing")

        super(game, x, y, Assets.Projectile)
        this.game = game

        this.hasHit = false

        this.game.physics.world.enable(this)
        this.game.add.existing(this)

        this.game.getSound(Assets.FxProjectileFired).play()

        this.setSize(this.width * PROJECTILE_COLLISION_BOUND_SCALE_X, this.height)

        log("constructed")
    }

    public update(time: number, delta: number, currentPiece: Piece) {
        // NOTE(tristan): may need to rework this if we ever want more than one piece on the board
        if (this.hasHit) {
            return
        }

        const pieceRelLeft = new Phaser.Math.Vector2(
            currentPiece.x - currentPiece.width / 2,
            currentPiece.y - currentPiece.height
        )
        const pieceWorldLeft = { x: 0, y: 0 } //this.game.board.canonicalizePosition(pieceRelLeft)
        const pieceRelRight = new Phaser.Math.Vector2(
            currentPiece.x + currentPiece.width / 2,
            currentPiece.y - currentPiece.height
        )
        const pieceWorldRight = { x: 0, y: 0 } // this.game.board.canonicalizePosition(pieceRelRight)

        if (this.body.hitTest(pieceWorldLeft.x, pieceWorldLeft.y)) {
            currentPiece.rotate(RotateDirection.CLOCKWISE)
            this.hasHit = true
        } else if (this.body.hitTest(pieceWorldRight.x, pieceWorldRight.y)) {
            currentPiece.rotate(RotateDirection.COUNTER_CLOCKWISE)
            this.hasHit = true
        }

        if (this.hasHit) {
            this.game.sound.play(Assets.FxPieceHit, { volume: 2.77, rate: 1.77 })
        }
    }
}
