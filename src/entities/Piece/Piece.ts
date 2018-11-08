import * as debug from "debug"
import { each } from "lodash"
import * as Phaser from "phaser"

import { Block } from "../Block"

import { Shape } from "./"

const log = debug("game:entities:Piece")

export abstract class Piece extends Phaser.GameObjects.Container {
    public blocks: Phaser.Physics.Arcade.Group

    protected color: Phaser.Display.Color
    protected shape: Shape

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y)

        log("constructed")
    }

    public abstract build(): void

    public getBlocks(): Block[] {
        return this.getAll() as Block[]
    }

    public setGravity(enabled: boolean) {
        each(this.getBlocks(), (block) => block.body.setAllowGravity(enabled))
    }

    public setupPhysics() {
        this.blocks = new Phaser.Physics.Arcade.Group(this.scene.physics.world, this.scene)
        this.blocks.addMultiple(this.getBlocks())
    }
}
