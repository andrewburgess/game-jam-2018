import * as Debug from "debug"
import * as Phaser from "phaser"

import UnifiedController from "../GameInput"
import { Assets } from "../assets"
import { Player } from "../entities/Player"

import { Scenes } from "./"

const log = Debug(`game:scenes:${Scenes.MovementTest}`)

class MovementTest extends Phaser.Scene {
    private controller: UnifiedController
    private player: Player
    private worldTop: Phaser.Physics.Arcade.Sprite

    constructor() {
        log("constructing")

        super({
            key: Scenes.MovementTest,
            physics: {
                arcade: {
                    debug: true,
                    gravity: { y: 100 }
                }
            }
        })

        log("constructed")
    }

    public create() {
        log("creating")

        const midX = this.cameras.main.width / 2
        const midY = this.cameras.main.height / 2

        this.controller = new UnifiedController(this.input)

        this.add.image(midX, midY, Assets.Background)

        this.player = new Player(this, midX, this.cameras.main.height)

        this.worldTop = this.physics.add.staticSprite(16, -16, "world_top")
        this.worldTop.setSize(this.physics.world.bounds.width, this.worldTop.height)

        this.physics.add.overlap(
            this.player.projectiles,
            this.worldTop,
            (worldTop: Phaser.Physics.Arcade.Sprite, playerProjectile: Phaser.Physics.Arcade.Sprite) => {
                // NOTE(tristan): this assumes a static map. Once projectiles leave the visible screen, they are gone forever
                if (worldTop.body.bottom >= playerProjectile.body.bottom) {
                    playerProjectile.destroy()
                }
            },
            undefined,
            this
        )

        log("created")
    }

    public update(time: number, delta: number) {
        if (this.controller.left!.isDown()) {
            this.player.setAccelerationX(this.controller.left!.getMagnitude() * -1500)
        } else if (this.controller.right!.isDown()) {
            this.player.setAccelerationX(this.controller.right!.getMagnitude() * 1500)
        } else {
            this.player.setAccelerationX(0)
        }

        if (this.controller.actionLB!.isUniquelyDown()) {
            const pProj: Phaser.Physics.Arcade.Body = this.player.projectiles.create(
                this.player.x - this.player.width + 15,
                this.player.y - this.player.height,
                Assets.Projectile
            )
            pProj.setVelocityY(-1050)
        }

        if (this.controller.actionRB!.isUniquelyDown()) {
            const pProj: Phaser.Physics.Arcade.Body = this.player.projectiles.create(
                this.player.x + this.player.width - 15,
                this.player.y - this.player.height,
                Assets.Projectile
            )
            pProj.setVelocityY(-1050)
        }
    }
}

export default MovementTest
