import * as debug from "debug"
import { each } from "lodash"
import * as Phaser from "phaser"

import Block from "../entities/Block"

import { Scenes } from "./"

const log = debug(`game:scenes:${Scenes.BlocksTest}`)

export default class BlocksTest extends Phaser.Scene {
    private blocks: Block[]

    constructor() {
        super({
            key: Scenes.BlocksTest
        })

        this.blocks = []

        log("constructed")
    }

    public create() {
        log("create")

        this.blocks.push(new Block(this, 300, 500))

        each(this.blocks, block => this.add.existing(block))
    }
}
