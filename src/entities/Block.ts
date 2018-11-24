import * as debug from "debug"
import * as Phaser from "phaser"

import { Assets } from "../assets"

import { Piece } from "./Piece"

export const BLOCK_SIZE = 32

const log = debug("game:entities:Block")

export class Block extends Phaser.GameObjects.Container {
    public piece: Piece

    private color: Phaser.Display.Color
    private emitterManager: Phaser.GameObjects.Particles.ParticleEmitterManager
    private emitter: Phaser.GameObjects.Particles.ParticleEmitter

    constructor(piece: Piece, x: number, y: number, color: string | Phaser.Display.Color = "#ffffff") {
        super(piece.scene, x, y)

        this.piece = piece

        this.color = typeof color === "string" ? Phaser.Display.Color.HexStringToColor(color) : color

        this.type = "Block"

        this.createBackground()
        this.createForeground()
        this.emitterManager = piece.scene.add.particles(Assets.ParticleEngineThrust)
        piece.add(this.emitterManager)
        piece.moveTo(this.emitterManager, 0)
        this.emitter = this.emitterManager.createEmitter({
            alpha: 0.6,
            blendMode: Phaser.BlendModes.ADD,
            follow: this,
            frequency: -1,
            lifespan: {
                onEmit: () => Phaser.Math.RND.between(300, 500)
            },
            scale: { start: 0.4, end: 0.0 },
            speed: {
                onEmit: () => Phaser.Math.RND.between(60, 120)
            }
        })

        log("constructed")
    }

    public setBeingBeamed(isBeingBeamed: boolean) {
        if (isBeingBeamed) {
            this.emitter.explode(4, this.x, this.y)
        }
    }

    private createBackground() {
        const rect = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, BLOCK_SIZE, BLOCK_SIZE)
        rect.setFillStyle(this.color.color, 1)
        rect.isFilled = true
        this.add(rect)
    }

    private createForeground() {
        const sprite = new Phaser.GameObjects.Sprite(this.scene, 0, 0, Assets.Blocks, Phaser.Math.RND.between(0, 7))
        sprite.setDisplaySize(BLOCK_SIZE, BLOCK_SIZE)
        this.add(sprite)
    }
}

export class EmptyBlock extends Phaser.GameObjects.Rectangle {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, BLOCK_SIZE, BLOCK_SIZE)

        this.fillAlpha = 0.05
        this.fillColor = 0xffffff
        this.strokeAlpha = 0.7
        this.strokeColor = 0xffffff
        this.isStroked = true
        this.isFilled = true
        this.setOrigin(0, 0.5)

        this.type = "EmptyBlock"
    }
}
