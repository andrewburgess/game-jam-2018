import * as debug from "debug"
import { each } from "lodash"
import * as Phaser from "phaser"

import { Piece, createPiece } from "../entities/Piece"

import { Scenes } from "./"

const log = debug(`game:scenes:${Scenes.BlocksTest}`)

export default class BlocksTest extends Phaser.Scene {
    private pieces: Piece[]
    private blocks: Phaser.Physics.Arcade.Group

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
        this.blocks = this.physics.add.group({
            bounceX: 0.5,
            bounceY: 0.5,
            collideWorldBounds: true
        })

        this.pieces.push(createPiece(this, Phaser.Math.RND.between(20, 800), Phaser.Math.RND.between(20, 600)))
        this.pieces.push(createPiece(this, Phaser.Math.RND.between(20, 800), Phaser.Math.RND.between(20, 600)))
        this.pieces.push(createPiece(this, Phaser.Math.RND.between(20, 800), Phaser.Math.RND.between(20, 600)))
        this.pieces.push(createPiece(this, Phaser.Math.RND.between(20, 800), Phaser.Math.RND.between(20, 600)))
        this.pieces.push(createPiece(this, Phaser.Math.RND.between(20, 800), Phaser.Math.RND.between(20, 600)))
        this.pieces.push(createPiece(this, Phaser.Math.RND.between(20, 800), Phaser.Math.RND.between(20, 600)))
        this.pieces.push(createPiece(this, Phaser.Math.RND.between(20, 800), Phaser.Math.RND.between(20, 600)))

        each(this.pieces, (piece) => {
            this.add.existing(piece)

            this.blocks.addMultiple(piece.getBlocks())
        })

        this.physics.add.collider(this.blocks, this.blocks)

        this.pieces[0].setPosition(800, 50)
        this.pieces[0].setGravity(false)

        setTimeout(
            () =>
                this.tweens.add({
                    props: {
                        x: {
                            duration: 2000,
                            ease: "Linear",
                            value: 200
                        }
                    },
                    targets: this.pieces[0]
                }),
            1000
        )

        setTimeout(() => this.pieces[0].setGravity(true), 4000)
    }
}
