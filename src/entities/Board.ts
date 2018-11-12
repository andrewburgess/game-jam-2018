import { each, every, map, range, some } from "lodash"
import * as Phaser from "phaser"

import { BLOCK_SIZE, Block } from "./Block"
import { Piece } from "./Piece"

export const BOARD_HEIGHT = 22
export const BOARD_WIDTH = 20

export class Board {
    private cells: Array<Array<Block | null>>

    constructor() {
        this.cells = map(range(BOARD_WIDTH), () => map(range(BOARD_HEIGHT), () => null))
    }

    public canPieceMoveTo(piece: Piece, x: number, y: number): boolean {
        const blocks = piece.getBlocks()

        return every(blocks, (block: Block) => {
            const blockX = block.x / BLOCK_SIZE
            const blockY = block.y / BLOCK_SIZE

            // Position to move to is out of bounds
            if (x + blockX >= BOARD_WIDTH || y + blockY >= BOARD_HEIGHT) {
                return false
            }

            const cell = this.cells[x + blockX][y + blockY]
            if (!cell) {
                // Cell is empty, this block can move there
                return true
            }

            if (cell.piece === block.piece) {
                // Cell is occupied, but it's occupied by a block from the same
                // piece, so it will move
                return true
            }

            // Cell is occupied by a block, the move can not be completed
            return false
        })
    }

    public touchingBottom(piece: Piece) {
        return some(piece.getBlocks(), (block) => {
            const blockY = block.y / BLOCK_SIZE

            return piece.location.y + blockY === BOARD_HEIGHT - 1
        })
    }

    public touchingLeft(piece: Piece) {
        return some(piece.getBlocks(), (block) => {
            const blockX = block.x / BLOCK_SIZE

            return piece.location.x + blockX === 0
        })
    }

    public touchingRight(piece: Piece) {
        return some(piece.getBlocks(), (block) => {
            const blockX = block.x / BLOCK_SIZE

            return piece.location.x + blockX === BOARD_WIDTH - 1
        })
    }

    public updateLocation(piece: Piece, oldLocation: Phaser.Math.Vector2, newLocation: Phaser.Math.Vector2) {
        each(piece.getBlocks(), (block) => {
            const blockX = block.x / BLOCK_SIZE
            const blockY = block.y / BLOCK_SIZE

            this.cells[blockX + oldLocation.x][blockY + oldLocation.y] = null
        })

        each(piece.getBlocks(), (block) => {
            const blockX = block.x / BLOCK_SIZE
            const blockY = block.y / BLOCK_SIZE

            this.cells[blockX + newLocation.x][blockY + newLocation.y] = block
        })
    }
}
