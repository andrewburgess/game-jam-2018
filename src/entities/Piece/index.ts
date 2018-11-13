import { sample } from "lodash"

import Game from "../../scenes/Game"

import { IPiece } from "./IPiece"
import { JPiece } from "./JPiece"
import { LPiece } from "./LPiece"
import { OPiece } from "./OPiece"
import { Piece } from "./Piece"
import { SPiece } from "./SPiece"
import { TPiece } from "./TPiece"
import { ZPiece } from "./ZPiece"

export enum Direction {
    LEFT,
    DOWN,
    RIGHT
}

export enum RotateDirection {
    CLOCKWISE,
    COUNTER_CLOCKWISE
}

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

export interface IPieceConfiguration {
    level?: number
    shape?: Shape
}

const ShapeValues = Object.keys(Shape)
    .map((n) => Number.parseInt(n, 10))
    .filter((n) => !Number.isNaN(n))

export function createPiece(scene: Game, x: number, y: number, config: IPieceConfiguration = {}) {
    let index: number
    if (config.shape === undefined) {
        index = sample(ShapeValues)!
    } else {
        index = config.shape
    }

    config.shape = index as Shape

    switch (index) {
        case Shape.I:
            return new IPiece(scene, x, y, config)
        case Shape.J:
            return new JPiece(scene, x, y, config)
        case Shape.L:
            return new LPiece(scene, x, y, config)
        case Shape.O:
            return new OPiece(scene, x, y, config)
        case Shape.S:
            return new SPiece(scene, x, y, config)
        case Shape.T:
            return new TPiece(scene, x, y, config)
        case Shape.Z:
            return new ZPiece(scene, x, y, config)
        default:
            throw new TypeError(`unknown piece shape ${config.shape}`)
    }
}
