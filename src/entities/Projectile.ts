import * as debug from "debug"
import * as Phaser from "phaser"

import { Assets } from "../assets"

const log = debug("game:entities:Projectile")

export class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        log("constructing")

        super(scene, x, y, Assets.Projectile)

        this.scene.physics.world.enable(this)
        this.scene.add.existing(this)

        log("constructed")
    }
}
