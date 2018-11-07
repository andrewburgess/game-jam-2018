import * as debug from "debug"
import * as Phaser from "phaser"

const log = debug("game:entities:Piece")

const BLOCK_SIZE = 32

export enum PieceShape {
    I = "I",
    J = "J",
    L = "L",
    O = "O",
    S = "S",
    T = "T",
    Z = "Z"
}

const I_COLOR = Phaser.Display.Color.HexStringToColor("#00FFFF")
const J_COLOR = Phaser.Display.Color.HexStringToColor("#0000FF")
const L_COLOR = Phaser.Display.Color.HexStringToColor("#FF8800")
const O_COLOR = Phaser.Display.Color.HexStringToColor("#FFFF00")
const S_COLOR = Phaser.Display.Color.HexStringToColor("#00FF00")
const T_COLOR = Phaser.Display.Color.HexStringToColor("#FF00FF")
const Z_COLOR = Phaser.Display.Color.HexStringToColor("#FF0000")

export class Piece extends Phaser.Physics.Matter.Sprite {
    // NOTE: Just collapse this hot mess
    public static generateTextures(graphics: Phaser.GameObjects.Graphics) {
        let fillColor: Phaser.Display.Color
        let strokeColor: Phaser.Display.Color

        // Generate I Shape
        fillColor = I_COLOR
        strokeColor = I_COLOR.clone().darken(50)
        graphics.lineStyle(1, strokeColor.color)
        graphics.fillStyle(fillColor.color)
        graphics.fillRect(0, 0, BLOCK_SIZE, BLOCK_SIZE)
        graphics.strokeRect(0, 0, BLOCK_SIZE, BLOCK_SIZE)
        graphics.fillRect(BLOCK_SIZE, 0, BLOCK_SIZE, BLOCK_SIZE)
        graphics.strokeRect(BLOCK_SIZE, 0, BLOCK_SIZE, BLOCK_SIZE)
        graphics.fillRect(BLOCK_SIZE * 2, 0, BLOCK_SIZE, BLOCK_SIZE)
        graphics.strokeRect(BLOCK_SIZE * 2, 0, BLOCK_SIZE, BLOCK_SIZE)
        graphics.fillRect(BLOCK_SIZE * 3, 0, BLOCK_SIZE, BLOCK_SIZE)
        graphics.strokeRect(BLOCK_SIZE * 3, 0, BLOCK_SIZE, BLOCK_SIZE)
        graphics.generateTexture(`PIECE_${PieceShape.I}`, BLOCK_SIZE * 4, BLOCK_SIZE)
        graphics.clear()

        // Generate J Shape
        fillColor = J_COLOR
        strokeColor = J_COLOR.clone().darken(50)
        graphics.lineStyle(1, strokeColor.color)
        graphics.fillStyle(fillColor.color)
        graphics.fillRect(0, 0, BLOCK_SIZE, BLOCK_SIZE)
        graphics.strokeRect(0, 0, BLOCK_SIZE, BLOCK_SIZE)
        graphics.fillRect(0, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
        graphics.strokeRect(0, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
        graphics.fillRect(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
        graphics.strokeRect(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
        graphics.fillRect(BLOCK_SIZE * 2, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
        graphics.strokeRect(BLOCK_SIZE * 2, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
        graphics.generateTexture(`PIECE_${PieceShape.J}`, BLOCK_SIZE * 3, BLOCK_SIZE * 2)
        graphics.clear()

        // Generate L Shape
        fillColor = L_COLOR
        strokeColor = L_COLOR.clone().darken(50)
        graphics.lineStyle(1, strokeColor.color)
        graphics.fillStyle(fillColor.color)
        graphics.fillRect(BLOCK_SIZE * 2, 0, BLOCK_SIZE, BLOCK_SIZE)
        graphics.strokeRect(BLOCK_SIZE * 2, 0, BLOCK_SIZE, BLOCK_SIZE)
        graphics.fillRect(0, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
        graphics.strokeRect(0, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
        graphics.fillRect(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
        graphics.strokeRect(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
        graphics.fillRect(BLOCK_SIZE * 2, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
        graphics.strokeRect(BLOCK_SIZE * 2, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
        graphics.generateTexture(`PIECE_${PieceShape.L}`, BLOCK_SIZE * 3, BLOCK_SIZE * 2)
        graphics.clear()

        // Generate O Shape
        fillColor = O_COLOR
        strokeColor = O_COLOR.clone().darken(50)
        graphics.lineStyle(1, strokeColor.color)
        graphics.fillStyle(fillColor.color)
        graphics.fillRect(0, 0, BLOCK_SIZE, BLOCK_SIZE)
        graphics.strokeRect(0, 0, BLOCK_SIZE, BLOCK_SIZE)
        graphics.fillRect(0, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
        graphics.strokeRect(0, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
        graphics.fillRect(BLOCK_SIZE, 0, BLOCK_SIZE, BLOCK_SIZE)
        graphics.strokeRect(BLOCK_SIZE, 0, BLOCK_SIZE, BLOCK_SIZE)
        graphics.fillRect(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
        graphics.strokeRect(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
        graphics.generateTexture(`PIECE_${PieceShape.O}`, BLOCK_SIZE * 2, BLOCK_SIZE * 2)
        graphics.clear()

        // Generate S Shape
        fillColor = S_COLOR
        strokeColor = S_COLOR.clone().darken(50)
        graphics.lineStyle(1, strokeColor.color)
        graphics.fillStyle(fillColor.color)
        graphics.fillRect(BLOCK_SIZE, 0, BLOCK_SIZE, BLOCK_SIZE)
        graphics.strokeRect(BLOCK_SIZE, 0, BLOCK_SIZE, BLOCK_SIZE)
        graphics.fillRect(BLOCK_SIZE * 2, 0, BLOCK_SIZE, BLOCK_SIZE)
        graphics.strokeRect(BLOCK_SIZE * 2, 0, BLOCK_SIZE, BLOCK_SIZE)
        graphics.fillRect(0, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
        graphics.strokeRect(0, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
        graphics.fillRect(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
        graphics.strokeRect(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
        graphics.generateTexture(`PIECE_${PieceShape.S}`, BLOCK_SIZE * 3, BLOCK_SIZE * 2)
        graphics.clear()

        // Generate T Shape
        fillColor = T_COLOR
        strokeColor = T_COLOR.clone().darken(50)
        graphics.lineStyle(1, strokeColor.color)
        graphics.fillStyle(fillColor.color)
        graphics.fillRect(BLOCK_SIZE, 0, BLOCK_SIZE, BLOCK_SIZE)
        graphics.strokeRect(BLOCK_SIZE, 0, BLOCK_SIZE, BLOCK_SIZE)
        graphics.fillRect(0, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
        graphics.strokeRect(0, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
        graphics.fillRect(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
        graphics.strokeRect(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
        graphics.fillRect(BLOCK_SIZE * 2, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
        graphics.strokeRect(BLOCK_SIZE * 2, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
        graphics.generateTexture(`PIECE_${PieceShape.T}`, BLOCK_SIZE * 3, BLOCK_SIZE * 2)
        graphics.clear()

        // Generate Z Shape
        fillColor = Z_COLOR
        strokeColor = Z_COLOR.clone().darken(50)
        graphics.lineStyle(1, strokeColor.color)
        graphics.fillStyle(fillColor.color)
        graphics.fillRect(0, 0, BLOCK_SIZE, BLOCK_SIZE)
        graphics.strokeRect(0, 0, BLOCK_SIZE, BLOCK_SIZE)
        graphics.fillRect(BLOCK_SIZE, 0, BLOCK_SIZE, BLOCK_SIZE)
        graphics.strokeRect(BLOCK_SIZE, 0, BLOCK_SIZE, BLOCK_SIZE)
        graphics.fillRect(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
        graphics.strokeRect(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
        graphics.fillRect(BLOCK_SIZE * 2, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
        graphics.strokeRect(BLOCK_SIZE * 2, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
        graphics.generateTexture(`PIECE_${PieceShape.Z}`, BLOCK_SIZE * 3, BLOCK_SIZE * 2)
        graphics.clear()
    }

    public static getGeometry(shape: PieceShape) {
        switch (shape) {
            case PieceShape.I:
                return {
                    shape: {
                        height: BLOCK_SIZE,
                        type: "rectangle",
                        width: BLOCK_SIZE * 4
                    }
                }
            case PieceShape.J:
                return {
                    shape: {
                        flagInternal: true,
                        type: "fromVerts",
                        verts: `0 0 ${BLOCK_SIZE} 0 ${BLOCK_SIZE} ${BLOCK_SIZE} ${BLOCK_SIZE *
                            3} ${BLOCK_SIZE} ${BLOCK_SIZE * 3} ${BLOCK_SIZE * 2} 0 ${BLOCK_SIZE * 2}`
                    }
                }
            case PieceShape.L:
                return {
                    shape: {
                        flagInternal: true,
                        type: "fromVerts",
                        verts: `0 ${BLOCK_SIZE} ${BLOCK_SIZE * 2} ${BLOCK_SIZE} ${BLOCK_SIZE * 2} 0 ${BLOCK_SIZE *
                            3} 0 ${BLOCK_SIZE * 3} ${BLOCK_SIZE * 2} 0 ${BLOCK_SIZE * 2}`
                    }
                }
            case PieceShape.O:
                return {
                    shape: {
                        height: BLOCK_SIZE * 2,
                        type: "rectangle",
                        width: BLOCK_SIZE * 2
                    }
                }
            case PieceShape.S:
                return {
                    shape: {
                        flagInternal: true,
                        type: "fromVerts",
                        verts: `${BLOCK_SIZE} 0 ${BLOCK_SIZE * 3} 0 ${BLOCK_SIZE * 3} ${BLOCK_SIZE} ${BLOCK_SIZE *
                            2} ${BLOCK_SIZE} ${BLOCK_SIZE * 2} ${BLOCK_SIZE * 2} 0 ${BLOCK_SIZE *
                            2} 0 ${BLOCK_SIZE} ${BLOCK_SIZE} ${BLOCK_SIZE}`
                    }
                }
            case PieceShape.T:
                return {
                    shape: {
                        flagInternal: true,
                        type: "fromVerts",
                        verts: `0 ${BLOCK_SIZE} ${BLOCK_SIZE} ${BLOCK_SIZE} ${BLOCK_SIZE} 0 ${BLOCK_SIZE *
                            2} 0 ${BLOCK_SIZE * 2} ${BLOCK_SIZE} ${BLOCK_SIZE * 3} ${BLOCK_SIZE} ${BLOCK_SIZE *
                            3} ${BLOCK_SIZE * 2} 0 ${BLOCK_SIZE * 2}`
                    }
                }
            case PieceShape.Z:
                return {
                    shape: {
                        flagInternal: true,
                        type: "fromVerts",
                        verts: `0 0 ${BLOCK_SIZE * 2} 0 ${BLOCK_SIZE * 2} ${BLOCK_SIZE} ${BLOCK_SIZE *
                            3} ${BLOCK_SIZE} ${BLOCK_SIZE * 3} ${BLOCK_SIZE * 2} ${BLOCK_SIZE} ${BLOCK_SIZE *
                            2} ${BLOCK_SIZE} ${BLOCK_SIZE} 0 ${BLOCK_SIZE}`
                    }
                }
            default:
                return {}
        }
    }

    private shape: PieceShape

    constructor(world: Phaser.Physics.Matter.World, shape: PieceShape, x: number, y: number) {
        super(world, x, y, `PIECE_${shape}`, 0, Piece.getGeometry(shape))

        this.shape = shape
        this.type = "Piece"

        this.setAngularVelocity(Phaser.Math.RND.realInRange(0, 0.5))
        this.setVelocity(Phaser.Math.RND.realInRange(-10.5, 10.5), Phaser.Math.RND.realInRange(-10.5, 10.5))
        this.setBounce(0.8)
        this.setMass(Phaser.Math.RND.realInRange(1, 10))

        log("constructed")
    }
}
