import * as debug from "debug"
import { each } from "lodash"
import * as Phaser from "phaser"

import { Piece, PieceShape } from "../entities/Piece"

import { Scenes } from "./"

const log = debug(`game:scenes:${Scenes.BlocksTest}`)

export default class BlocksTest extends Phaser.Scene {
    private pieces: Piece[]
    private blockColliders: Phaser.Physics.Arcade.Group

    constructor() {
        super({
            key: Scenes.BlocksTest,
            physics: {
                arcade: {
                    debug: true,
                    gravity: { y: 200 }
                }
            }
        })

        this.pieces = []

        log("constructed")
    }

    public create() {
        log("create")

        this.physics.world.setBounds(0, 0, this.cameras.main.width, this.cameras.main.height)
        this.blockColliders = this.physics.add.group({
            bounceX: 0.5,
            bounceY: 0.5,
            collideWorldBounds: true
        })

        this.pieces.push(
            new Piece(this, PieceShape.I, Phaser.Math.RND.between(20, 800), Phaser.Math.RND.between(20, 600))
        )
        this.pieces.push(
            new Piece(this, PieceShape.J, Phaser.Math.RND.between(20, 800), Phaser.Math.RND.between(20, 600))
        )
        this.pieces.push(
            new Piece(this, PieceShape.L, Phaser.Math.RND.between(20, 800), Phaser.Math.RND.between(20, 600))
        )
        this.pieces.push(
            new Piece(this, PieceShape.O, Phaser.Math.RND.between(20, 800), Phaser.Math.RND.between(20, 600))
        )
        this.pieces.push(
            new Piece(this, PieceShape.S, Phaser.Math.RND.between(20, 800), Phaser.Math.RND.between(20, 600))
        )
        this.pieces.push(
            new Piece(this, PieceShape.T, Phaser.Math.RND.between(20, 800), Phaser.Math.RND.between(20, 600))
        )
        this.pieces.push(
            new Piece(this, PieceShape.Z, Phaser.Math.RND.between(20, 800), Phaser.Math.RND.between(20, 600))
        )

        each(this.pieces, (piece) => {
            this.add.existing(piece)
            this.blockColliders.addMultiple(piece.getBlocks())
        })

        this.physics.add.collider(this.blockColliders, this.blockColliders)
    }
}
