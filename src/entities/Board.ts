import { each, every, map, range, some } from "lodash"
import * as Phaser from "phaser"

import { Assets } from "../assets"
import { ILevel, IPlatform } from "../levels"
import Game from "../scenes/Game"

import { BLOCK_SIZE } from "./Block"
import { Piece } from "./Piece"

export class Board extends Phaser.GameObjects.Container {
    private cells: Array<Array<Piece | null>>
    private level: ILevel

    constructor(scene: Game, x: number, y: number, level: ILevel) {
        super(scene, x, y)

        this.level = level
        this.cells = map(range(level.width), () => map(range(level.height), () => null))

        this.setupPlatforms()
    }

    public canPieceMoveTo(piece: Piece, x: number, y: number, angle?: number) {
        if (angle === undefined) {
            angle = piece.actualAngle
        }

        const blockCoordinates = piece.getBlockLocations(angle)
        return every(blockCoordinates, (coordinates) => {
            // Position to move to is out of bounds
            if (
                x + coordinates.x >= this.level.width ||
                y + coordinates.y >= this.level.height ||
                x + coordinates.x < 0 ||
                y + coordinates.y < 0
            ) {
                return false
            }

            const cell = this.cells[x + coordinates.x][y + coordinates.y]
            if (cell === piece) {
                // Cell is occupied, but it's occupied by a block from the same
                // piece, so it will move
                return true
            }

            if (cell === null) {
                // Cell is empty, check to see if a platform is in the way
                return every(this.level.platforms, (platform: IPlatform) => {
                    const xcoord = x + coordinates.x
                    const ycoord = y + coordinates.y

                    return (
                        xcoord < platform.x || // To the left of the platform
                        xcoord >= platform.x + platform.width || // To the right of the platform
                        (xcoord >= platform.x && xcoord < platform.x + platform.width && ycoord !== platform.y) // Over the platform, but on a different row
                    )
                })
            }

            // Cell is occupied by a block, the move can not be completed
            return false
        })
    }

    public touchingBottom(piece: Piece) {
        return some(
            piece.getBlockLocations(),
            (coordinate) => piece.location.y + coordinate.y === this.level.height - 1
        )
    }

    public touchingLeft(piece: Piece) {
        return some(piece.getBlockLocations(), (coordinate) => piece.location.x + coordinate.x === 0)
    }

    public touchingRight(piece: Piece) {
        return some(piece.getBlockLocations(), (coordinate) => piece.location.x + coordinate.x === this.level.width - 1)
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
        each(range(this.level.width + 1), (x) =>
            this.add(
                new Phaser.GameObjects.Line(
                    this.scene,
                    BLOCK_SIZE / 2,
                    ((this.level.height + 2) * BLOCK_SIZE) / 2,
                    (x - 1) * BLOCK_SIZE,
                    -BLOCK_SIZE,
                    (x - 1) * BLOCK_SIZE,
                    (this.level.height + 2) * BLOCK_SIZE,
                    0x0000ff,
                    0.3
                )
            )
        )
        each(range(this.level.height + 1), (y) =>
            this.add(
                new Phaser.GameObjects.Line(
                    this.scene,
                    ((this.level.width + 2) * BLOCK_SIZE) / 2,
                    BLOCK_SIZE / 2,
                    -BLOCK_SIZE,
                    (y - 1) * BLOCK_SIZE,
                    (this.level.width + 2) * BLOCK_SIZE,
                    (y - 1) * BLOCK_SIZE,
                    0xff0000,
                    0.3
                )
            )
        )
    }

    private setupPlatforms() {
        const platforms = this.level.platforms

        each(platforms, (platform) =>
            this.add(
                this.scene.add
                    .image(platform.x * BLOCK_SIZE - BLOCK_SIZE / 2, platform.y * BLOCK_SIZE, Assets.Platform)
                    .setDisplaySize(platform.width * BLOCK_SIZE, 16)
                    .setOrigin(0, 1)
            )
        )
    }
}
