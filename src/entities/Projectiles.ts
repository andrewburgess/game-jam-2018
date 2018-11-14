import * as debug from "debug"
import * as Phaser from "phaser"

import { Projectile } from "./Projectile"

const log = debug("game:entities:Projectiles")

export class Projectiles extends Phaser.GameObjects.Container {
    public elements: Phaser.Physics.Arcade.Group
    public scene: Phaser.Scene

    constructor(scene: Phaser.Scene, x: number, y: number) {
        log("constructing")

        super(scene, x, y)
        this.scene = scene
        this.elements = new Phaser.Physics.Arcade.Group(this.scene.physics.world, this.scene)
        this.scene.add.existing(this)

        log("constructed")
    }

    public createProjectile(gunPosX: number, gunPosY: number, velocityX: number, velocityY: number) {
        const pProj: Projectile = new Projectile(this.scene, gunPosX, gunPosY)

        this.add(pProj)

        this.elements.add(pProj)
        pProj.setVelocityY(velocityY)
    }

    public destroyOnCollisionWith(boundary: Phaser.Physics.Arcade.Sprite) {
        this.scene.physics.add.overlap(
            this.elements,
            boundary,
            (collidedBoundary: Phaser.Physics.Arcade.Sprite, playerProjectile: Phaser.Physics.Arcade.Sprite) => {
                if (collidedBoundary.body.bottom >= playerProjectile.body.bottom) {
                    playerProjectile.destroy()
                }
            },
            undefined,
            this.scene
        )
    }

    public getElements(): Projectile[] {
        return this.getAll() as Projectile[]
    }
}
