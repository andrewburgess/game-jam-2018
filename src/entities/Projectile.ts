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
        this.setSize(this.width * 0.6, this.height * 0.8)
        this.game.board.add(this)

        this.game.fxSounds.get(Assets.FxProjectileFired).play()

        log("constructed")
    }

    public update(time: number, delta: number) {
        if (!this.active) {
            return
        }

        const piece = this.game.getCurrentPiece()

        if (!piece) {
            return
        }

        if (
            this.game.board.hitToRotate(
                piece,
                this.x - this.body.width * this.originX,
                this.y - this.body.height * this.originY - 16,
                this.body.width,
                this.body.height - 16
            )
        ) {
            this.game.fxSounds.get(Assets.FxPieceHit).play()
            this.destroy()
            log("hit")
        }
    }
}
