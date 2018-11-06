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
            key: Scenes.BlocksTest
        })

        this.pieces = []

        log("constructed")
    }

    public create() {
        log("create")

        this.pieces.push(new Piece(this, PieceShape.I, 50, 40))
        this.pieces.push(new Piece(this, PieceShape.J, 50, 120))
        this.pieces.push(new Piece(this, PieceShape.L, 50, 200))
        this.pieces.push(new Piece(this, PieceShape.O, 50, 280))
        this.pieces.push(new Piece(this, PieceShape.S, 50, 360))
        this.pieces.push(new Piece(this, PieceShape.T, 50, 440))
        this.pieces.push(new Piece(this, PieceShape.Z, 50, 520))

        each(this.pieces, (piece) => this.add.existing(piece))
    }
}
