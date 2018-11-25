import * as debug from "debug"
import * as Phaser from "phaser"

import { Assets } from "../assets"
import Game from "../scenes/Game"

const log = debug("game:entities:Projectile")

export class Projectile extends Phaser.Physics.Arcade.Sprite {
    public body: Phaser.Physics.Arcade.Body
    private game: Game

    constructor(game: Game, x: number, y: number) {
        log("constructing")

        super(game, x, y, Assets.Projectile)
        this.game = game

        this.game.physics.world.enable(this)
        this.body.setAllowGravity(false)
        this.game.board.add(this)

        this.game.fxSounds.get(Assets.FxProjectileFired).play()

        log("constructed")
    }

    public update(time: number, delta: number) {
        const piece = this.game.getCurrentPiece()

        if (!piece) {
            return
        }

        if (
            this.game.board.hitToRotate(
                piece,
                this.x - this.width * this.originX,
                this.y - this.height * this.originY,
                this.width,
                this.height
            )
        ) {
            log("hit")
        }

        /*const pieceRelLeft = new Phaser.Math.Vector2(
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
            this.game.fxSounds.get(Assets.FxPieceHit).play()
        }*/
    }
}
