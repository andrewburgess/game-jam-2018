import * as debug from "debug"
import { throttle } from "lodash"
import * as Phaser from "phaser"

import { ILevel } from "../levels"
import Game from "../scenes/Game"

import { Data } from "./Data"
import { Piece } from "./Piece"
import { Projectile } from "./Projectile"

const log = debug("game:entities:Projectiles")

export const PROJECTILE_STANDARD_VELOCITY = -1200

// Amount of time between projectile firings
const FIRE_RATE = 500

export class Projectiles extends Phaser.GameObjects.Container {
    public elements: Phaser.Physics.Arcade.Group

    private game: Game
    private level: ILevel
    private regenerateInterval: number

    constructor(game: Game, x: number, y: number) {
        log("constructing")

        super(game, x, y)
        this.game = game

        this.elements = new Phaser.Physics.Arcade.Group(this.game.physics.world, this.game)

        this.level = game.getLevel()

        this.scene.registry.set(Data.AMMO_CURRENT, this.level.ammo.maximum)
        this.scene.registry.set(Data.AMMO_MAX, this.level.ammo.maximum)

        this.fireProjectile = throttle(this.fireProjectile.bind(this), FIRE_RATE, {
            leading: true,
            trailing: false
        })
        this.regenerateAmmo = throttle(this.regenerateAmmo.bind(this), this.level.ammo.regenerationInterval, {
            leading: false,
            trailing: true
        })

        const worldTop: Phaser.Physics.Arcade.Sprite = this.game.physics.add.staticSprite(16, -16, "world_top")
        worldTop.setSize(this.game.physics.world.bounds.width, worldTop.height)

        this.game.physics.add.overlap(
            this.elements,
            worldTop,
            (collidedBoundary: Phaser.Physics.Arcade.Sprite, playerProjectile: Phaser.Physics.Arcade.Sprite) => {
                if (collidedBoundary.body.bottom >= playerProjectile.body.bottom) {
                    playerProjectile.destroy()
                }
            }
        )

        log("constructed")
    }

    public destroy() {
        clearInterval(this.regenerateInterval)

        super.destroy()
    }

    public fire() {
        const current = this.game.registry.get(Data.AMMO_CURRENT)

        if (current === 0) {
            log("no ammo left")
            return
        }

        this.fireProjectile()
    }

    public getElements(): Projectile[] {
        return this.getAll() as Projectile[]
    }

    private createProjectile(gunPosX: number, gunPosY: number, velocityY: number) {
        const pProj: Projectile = new Projectile(this.game, gunPosX, gunPosY)

        this.elements.add(pProj)
        pProj.setVelocityY(velocityY)
    }

    private fireProjectile() {
        const current = this.game.registry.get(Data.AMMO_CURRENT)
        this.game.registry.set(Data.AMMO_CURRENT, Math.max(0, current - 1))

        this.createProjectile(
            this.parentContainer.x + this.parentContainer.width / 2,
            this.parentContainer.y + this.y,
            PROJECTILE_STANDARD_VELOCITY
        )

        this.regenerateAmmo()
    }

    private regenerateAmmo() {
        let current: number = this.game.registry.get(Data.AMMO_CURRENT)
        current = Math.min(current + 1, this.level.ammo.maximum)

        this.game.registry.set(Data.AMMO_CURRENT, current)

        if (current < this.level.ammo.maximum) {
            this.regenerateAmmo()
        }
    }
}
