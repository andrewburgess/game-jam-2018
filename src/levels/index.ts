import { merge } from "lodash"

export interface IAmmoConfiguration {
    /**
     * Maximum amount of ammunition the player can have (also what they start the level with)
     *
     * @type {number}
     * @memberof IAmmoConfiguration
     */
    maximum: number

    /**
     * How often a new unit of ammo spawns (in milliseconds)
     */
    regenerationInterval: number
}

export interface IBeamConfiguration {
    /**
     * Rate at which Beam resource is consumed (units per second)
     *
     * @type {number}
     * @memberof IBeamConfiguration
     */
    consumptionRate: number

    /**
     * Maximum amount of Beam resource the player can have
     *
     * @type {number}
     * @memberof IBeamConfiguration
     */
    maximum: number

    /**
     * Rate at which Beam resource is regenerated (units per second)
     *
     * @type {number}
     * @memberof IBeamConfiguration
     */
    regenerationRate: number
}

export interface ILevel {
    readonly ammo: IAmmoConfiguration
    readonly beam: IBeamConfiguration

    /**
     * Amount of money the player starts with
     *
     * @type {number}
     * @memberof ILevel
     */
    readonly budget: number

    /**
     * Description of the Level
     *
     * @type {string}
     * @memberof ILevel
     */
    readonly description: string

    /**
     * Total number of rows in the game board
     *
     * @type {number}
     * @memberof ILevel
     */
    readonly height: number

    /**
     * Platforms in the level where building spots are located
     *
     * @type {IPlatform[]}
     * @memberof ILevel
     */
    readonly platforms: IPlatform[]

    /**
     * Duration between piece movements in milliseconds
     *
     * @type {number}
     * @memberof ILevel
     */
    readonly speed: number

    /**
     * Total number of columns in the game board
     *
     * @type {number}
     * @memberof ILevel
     */
    readonly width: number

    /**
     * Amount of zoom on the camera for if the levels get larger than the
     * viewport
     *
     * @type {number}
     * @memberof ILevel
     */
    readonly zoom: number
}

export interface IPlatform {
    /**
     * Defines the shape of the structure to build.
     *
     * Starts from the lower left portion of the platform, going to the right
     * and then up to the left for the next row
     *
     * Uses a `#` to mark a cell, and a ` ` to mark an empty space
     *
     * @type {string}
     * @memberof IPlatform
     */
    cells: string

    /**
     * Number of blocks wide the platform is
     *
     * @type {number}
     * @memberof IPlatform
     */
    width: number

    /**
     * X coordinate for the platform
     *
     * @type {number}
     * @memberof IPlatform
     */
    x: number

    /**
     * Y coordinate for the platform
     *
     * @type {number}
     * @memberof IPlatform
     */
    y: number
}

const LevelDefaults = {
    ammo: {
        maximum: 5,
        regenerationInterval: 3000
    },
    beam: {
        consumptionRate: 30,
        maximum: 100,
        regenerationRate: 10
    },
    height: 16,
    speed: 500,
    width: 29,
    zoom: 1
}

export const Levels: { [key: string]: ILevel } = {
    [1]: merge({}, LevelDefaults, {
        beam: {
            consumptionRate: 50
        },
        budget: 2000,
        description: `Establish a forward operating base at Output X417`,
        height: 9,
        platforms: [
            {
                cells: "## #",
                width: 2,
                x: 2,
                y: 6
            },
            {
                cells: "### ",
                width: 2,
                x: 9,
                y: 6
            }
        ],
        width: 13,
        zoom: 1.4
    }),
    [2]: merge({}, LevelDefaults, {
        budget: 3600,
        description: `Set up supply depots for the Ares Sector`,
        height: 11,
        platforms: [
            {
                cells: "####",
                width: 1,
                x: 2,
                y: 6
            },
            {
                cells: "####",
                width: 1,
                x: 13,
                y: 6
            },
            {
                cells: "####",
                width: 4,
                x: 6,
                y: 8
            }
        ],
        speed: 450,
        width: 16,
        zoom: 1.2
    }),
    [3]: merge({}, LevelDefaults, {
        budget: 8000,
        description: `Command wants a communications base`,
        height: 13,
        platforms: [
            {
                cells: "########### ##   #    #  ",
                width: 5,
                x: 5,
                y: 8
            },
            {
                cells: "##### ##    #  ",
                width: 5,
                x: 10,
                y: 8
            }
        ],
        speed: 300,
        width: 20,
        zoom: 1.15
    }),
    [4]: merge({}, LevelDefaults, {
        ammo: {
            maximum: 3,
            regenerationInterval: 5000
        },
        beam: {
            consumptionRate: 50,
            maximum: 100,
            regenerationRate: 5
        },
        budget: 6000,
        description: `Galactic disturbances are affecting beam and impulse
weapon effectiveness...

or something, the story is kind of thin at this point,
just use your imagination`,
        height: 12,
        platforms: [
            {
                cells: "#######  #  ",
                width: 3,
                x: 3,
                y: 8
            },
            {
                cells: "#### ## ",
                width: 4,
                x: 13,
                y: 5
            }
        ],
        speed: 300,
        width: 17,
        zoom: 1.15
    }),
    [5]: merge({}, LevelDefaults, {
        budget: 8000,
        description: `This one is quick! Hope you're ready`,
        height: 11,
        platforms: [
            {
                cells: "####",
                width: 2,
                x: 1,
                y: 5
            },
            {
                cells: "####",
                width: 2,
                x: 6,
                y: 7
            },
            {
                cells: "####",
                width: 2,
                x: 11,
                y: 4
            },
            {
                cells: "####",
                width: 2,
                x: 16,
                y: 8
            },
            {
                cells: "####",
                width: 2,
                x: 20,
                y: 5
            },
            {
                cells: "####",
                width: 2,
                x: 24,
                y: 10
            }
        ],
        speed: 150,
        width: 28,
        zoom: 1
    }),
    [6]: merge({}, LevelDefaults, {
        ammo: {
            maximum: 10,
            regenerationInterval: 2000
        },
        beam: {
            consumptionRate: 20
        },
        budget: 20000,
        description: `Hey, glad you're still playing!

This is the last one!`,
        height: 19,
        platforms: [
            {
                cells: "### # ",
                width: 2,
                x: 3,
                y: 7
            },
            {
                cells: "######  ",
                width: 4,
                x: 5,
                y: 11
            },
            {
                cells: "###",
                width: 3,
                x: 6,
                y: 15
            },
            {
                cells: "##### #  #  ",
                width: 3,
                x: 14,
                y: 8
            },
            {
                cells: "######  ##  ",
                width: 6,
                x: 14,
                y: 14
            },
            {
                cells: "### # ",
                width: 3,
                x: 22,
                y: 9
            },
            {
                cells: "###  #",
                width: 3,
                x: 26,
                y: 4
            },
            {
                cells: "#####  # ",
                width: 3,
                x: 27,
                y: 12
            }
        ],
        speed: 300,
        width: 33,
        zoom: 0.9
    })
}
