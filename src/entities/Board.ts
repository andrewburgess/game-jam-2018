import { each, every, map, range, some } from "lodash"
import * as Phaser from "phaser"

import Game from "../scenes/Game"

import { BLOCK_SIZE, Block } from "./Block"
import { Piece } from "./Piece"

export const BOARD_HEIGHT = 22
export const BOARD_WIDTH = 20

export class Board extends Phaser.GameObjects.Container {
    private cells: Array<Array<Piece | null>>

    constructor(scene: Game, x: number, y: number) {
        super(scene, x, y)
        this.cells = map(range(BOARD_WIDTH), () => map(range(BOARD_HEIGHT), () => null))
    }

    public canPieceMoveTo(piece: Piece, x: number, y: number, angle?: number) {
        if (angle === undefined) {
            angle = piece.actualAngle
        }

        const blockCoordinates = piece.getBlockLocations(angle)
        return every(blockCoordinates, (coordinates) => {
            // Position to move to is out of bounds
            if (
                x + coordinates.x >= BOARD_WIDTH ||
                y + coordinates.y >= BOARD_HEIGHT ||
                x + coordinates.x < 0 ||
                y + coordinates.y < 0
            ) {
                return false
            }

            const cell = this.cells[x + coordinates.x][y + coordinates.y]
            if (cell === null) {
                // Cell is empty, this block can move there
                return true
            }

            if (cell === piece) {
                // Cell is occupied, but it's occupied by a block from the same
                // piece, so it will move
                return true
            }

            // Cell is occupied by a block, the move can not be completed
            return false
        })
    }

    public touchingBottom(piece: Piece) {
        return some(piece.getBlockLocations(), (coordinate) => piece.location.y + coordinate.y === BOARD_HEIGHT - 1)
    }

    public touchingLeft(piece: Piece) {
        return some(piece.getBlockLocations(), (coordinate) => piece.location.x + coordinate.x === 0)
    }

    public touchingRight(piece: Piece) {
        return some(piece.getBlockLocations(), (coordinate) => piece.location.x + coordinate.x === BOARD_WIDTH - 1)
    }

    public updateLocation(
        piece: Piece,
        oldLocation: Phaser.Math.Vector2,
        newLocation: Phaser.Math.Vector2,
        oldAngle: number,
        newAngle: number
    ) {
        each(piece.getBlockLocations(oldAngle), (coordinate) => {
            this.cells[coordinate.x + oldLocation.x][coordinate.y + oldLocation.y] = null
        })

        each(piece.getBlockLocations(newAngle), (coordinate) => {
            this.cells[coordinate.x + newLocation.x][coordinate.y + newLocation.y] = piece
        })
    }

    public drawBoard() {
        each(range(BOARD_WIDTH + 1), (x) =>
            this.add(
                new Phaser.GameObjects.Line(
                    this.scene,
                    BLOCK_SIZE / 2,
                    ((BOARD_HEIGHT + 2) * BLOCK_SIZE) / 2,
                    (x - 1) * BLOCK_SIZE,
                    -BLOCK_SIZE,
                    (x - 1) * BLOCK_SIZE,
                    (BOARD_HEIGHT + 2) * BLOCK_SIZE,
                    0x0000ff,
                    0.3
                )
            )
        )
        each(range(BOARD_HEIGHT + 1), (y) =>
            this.add(
                new Phaser.GameObjects.Line(
                    this.scene,
                    ((BOARD_WIDTH + 2) * BLOCK_SIZE) / 2,
                    BLOCK_SIZE / 2,
                    -BLOCK_SIZE,
                    (y - 1) * BLOCK_SIZE,
                    (BOARD_WIDTH + 2) * BLOCK_SIZE,
                    (y - 1) * BLOCK_SIZE,
                    0xff0000,
                    0.3
                )
            )
        )
    }
}
