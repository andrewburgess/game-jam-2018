import * as debug from "debug"
import { each } from "lodash"
import * as Phaser from "phaser"

import { Piece, PieceShape } from "../entities/Piece"

import { Scenes } from "./"

const log = debug(`game:scenes:${Scenes.BlocksTest}`)

export default class BlocksTest extends Phaser.Scene {
    private pieces: Piece[]

    constructor() {
        super({
            key: Scenes.BlocksTest,
            physics: {
                default: "matter",
                matter: {
                    debug: true,
                    gravity: {
                        y: 0.1
                    }
                }
            }
        })

        this.pieces = []

        log("constructed")
    }

    public preload() {
        Piece.generateTextures(this.add.graphics())
    }

    public create() {
        log("create")

        this.matter.world.setBounds()

        this.pieces.push(new Piece(this.matter.world, PieceShape.I, Phaser.Math.RND.between(0, 600), 40))
        this.pieces.push(new Piece(this.matter.world, PieceShape.J, Phaser.Math.RND.between(0, 600), 120))
        this.pieces.push(new Piece(this.matter.world, PieceShape.L, Phaser.Math.RND.between(0, 600), 200))
        this.pieces.push(new Piece(this.matter.world, PieceShape.O, Phaser.Math.RND.between(0, 600), 280))
        this.pieces.push(new Piece(this.matter.world, PieceShape.S, Phaser.Math.RND.between(0, 600), 360))
        this.pieces.push(new Piece(this.matter.world, PieceShape.T, Phaser.Math.RND.between(0, 600), 440))
        this.pieces.push(new Piece(this.matter.world, PieceShape.Z, Phaser.Math.RND.between(0, 600), 520))
        this.pieces.push(new Piece(this.matter.world, PieceShape.I, Phaser.Math.RND.between(0, 600), 40))
        this.pieces.push(new Piece(this.matter.world, PieceShape.J, Phaser.Math.RND.between(0, 600), 120))
        this.pieces.push(new Piece(this.matter.world, PieceShape.L, Phaser.Math.RND.between(0, 600), 200))
        this.pieces.push(new Piece(this.matter.world, PieceShape.O, Phaser.Math.RND.between(0, 600), 280))
        this.pieces.push(new Piece(this.matter.world, PieceShape.S, Phaser.Math.RND.between(0, 600), 360))
        this.pieces.push(new Piece(this.matter.world, PieceShape.T, Phaser.Math.RND.between(0, 600), 440))
        this.pieces.push(new Piece(this.matter.world, PieceShape.Z, Phaser.Math.RND.between(0, 600), 520))

        each(this.pieces, (piece) => this.add.existing(piece))
    }
}
