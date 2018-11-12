import { every, map, range } from "lodash"

import { BLOCK_SIZE, Block } from "./Block"
import { Piece } from "./Piece"

export const BOARD_HEIGHT = 25
export const BOARD_WIDTH = 30

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
}
