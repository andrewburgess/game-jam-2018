import { each, every, map, range, some } from "lodash"
import * as Phaser from "phaser"

import { Assets } from "../assets"
import { ILevel, IPlatform } from "../levels"
import Game from "../scenes/Game"

import { BLOCK_SIZE, EmptyBlock } from "./Block"
import { Piece } from "./Piece"

export class Board extends Phaser.GameObjects.Container {
    private cells: Array<Array<Piece | null>>
    private toFill: Vector2Like[]
    private level: ILevel

    constructor(scene: Game, x: number, y: number, level: ILevel) {
        super(scene, x, y)

        this.level = level
        this.cells = map(range(level.width), () => map(range(level.height), () => null))
        this.toFill = []

        this.setupPlatforms()
        this.drawBorders()
        this.drawSpawnLocation()
    }

    public canonicalizePosition(boardRelativePos: Phaser.Math.Vector2): Phaser.Math.Vector2 {
        const worldPos = new Phaser.Math.Vector2()

        worldPos.x = this.x + boardRelativePos.x
        worldPos.y = this.y + boardRelativePos.y

        return worldPos
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

    public isComplete() {
        return every(this.toFill, (vec) => !!this.cells[vec.x][vec.y])
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

    private drawBorders() {
        const leftSide = new Phaser.GameObjects.Line(
            this.scene,
            -4,
            (this.level.height * BLOCK_SIZE) / 2 - BLOCK_SIZE / 2,
            (-1 * BLOCK_SIZE) / 2,
            0,
            (-1 * BLOCK_SIZE) / 2,
            this.level.height * BLOCK_SIZE,
            0x666666,
            1
        )

        const rightSide = new Phaser.GameObjects.Line(
            this.scene,
            (this.level.width - 1) * BLOCK_SIZE + 4,
            (this.level.height * BLOCK_SIZE) / 2 - BLOCK_SIZE / 2,
            BLOCK_SIZE / 2,
            0,
            BLOCK_SIZE / 2,
            this.level.height * BLOCK_SIZE,
            0x666666,
            1
        )

        leftSide.setLineWidth(4, 4)
        rightSide.setLineWidth(4, 4)

        this.add(leftSide)
        this.add(rightSide)
    }

    private drawSpawnLocation() {
        this.add(
            new Phaser.GameObjects.Graphics(this.scene)
                .lineStyle(2, 0xff0000, 1)
                .strokeRect((-1 * BLOCK_SIZE) / 2, -1 * BLOCK_SIZE, BLOCK_SIZE * 4, 2)
        )
    }

    private setupPlatforms() {
        const platforms = this.level.platforms

        each(platforms, (platform) => {
            // Draw platforms
            const platformX = platform.x * BLOCK_SIZE - BLOCK_SIZE / 2
            const platformY = platform.y * BLOCK_SIZE

            this.add(
                this.scene.add
                    .image(platformX, platformY, Assets.Platform)
                    .setDisplaySize(platform.width * BLOCK_SIZE, 16)
                    .setOrigin(0, 1)
            )

            // Parse cells
            each(platform.cells, (cell, index) => {
                if (cell === " ") {
                    return
                }

                this.add(
                    new EmptyBlock(
                        this.scene,
                        platformX + (index % platform.width) * BLOCK_SIZE,
                        platformY - (Math.floor(index / platform.width) + 1) * BLOCK_SIZE
                    )
                )

                this.toFill.push({
                    x: platform.x + (index % platform.width),
                    y: platform.y - 1 - Math.floor(index / platform.width)
                })
            })
        })
    }
}
