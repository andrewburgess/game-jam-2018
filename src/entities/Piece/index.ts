import { isUndefined, sample } from "lodash"
import * as Phaser from "phaser"

import { IPiece } from "./IPiece"
import { JPiece } from "./JPiece"
import { LPiece } from "./LPiece"
import { OPiece } from "./OPiece"
import { Piece } from "./Piece"
import { SPiece } from "./SPiece"
import { TPiece } from "./TPiece"
import { ZPiece } from "./ZPiece"

export enum Shape {
    I,
    J,
    L,
    O,
    S,
    T,
    Z
}

export { Piece }

const ShapeValues = Object.keys(Shape)
    .map((n) => Number.parseInt(n, 10))
    .filter((n) => !Number.isNaN(n))

export function createPiece(scene: Phaser.Scene, x: number, y: number, shape?: Shape) {
    let index: number
    if (isUndefined(shape)) {
        index = sample(ShapeValues)!
    } else {
        index = shape
    }

    let piece: Piece

    switch (index) {
        case Shape.I:
            piece = new IPiece(scene, x, y)
            break
        case Shape.J:
            piece = new JPiece(scene, x, y)
            break
        case Shape.L:
            piece = new LPiece(scene, x, y)
            break
        case Shape.O:
            piece = new OPiece(scene, x, y)
            break
        case Shape.S:
            piece = new SPiece(scene, x, y)
            break
        case Shape.T:
            piece = new TPiece(scene, x, y)
            break
        case Shape.Z:
            piece = new ZPiece(scene, x, y)
            break
        default:
            throw new TypeError(`unknown shape type ${shape}`)
    }

    piece.build()
    piece.setupPhysics()
    return piece
}
