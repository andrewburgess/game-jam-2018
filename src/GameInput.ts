interface IUnifiedController {
    up?: VirtualKey
    down?: VirtualKey
    left?: VirtualKey
    right?: VirtualKey
    actionLB?: VirtualKey
    actionRB?: VirtualKey
}

export default class UnifiedController implements IUnifiedController {
    public up?: VirtualKey
    public down?: VirtualKey
    public left?: VirtualKey
    public right?: VirtualKey
    public actionLB?: VirtualKey
    public actionRB?: VirtualKey

    private plugin: Phaser.Input.InputPlugin

    constructor(plugin: Phaser.Input.InputPlugin) {
        this.plugin = plugin

        // TODO(tristan): worth keeping init out of constructor?
        this.up = new VirtualKey(plugin.keyboard.addKey("W"))
        this.down = new VirtualKey(plugin.keyboard.addKey("S"))
        this.left = new VirtualKey(plugin.keyboard.addKey("A"))
        this.right = new VirtualKey(plugin.keyboard.addKey("D"))
        this.actionLB = new VirtualKey(plugin.keyboard.addKey("LEFT"))
        this.actionRB = new VirtualKey(plugin.keyboard.addKey("RIGHT"))

        this.plugin.gamepad.once(
            "down",
            (pad: Phaser.Input.Gamepad.Gamepad, button: Phaser.Input.Gamepad.Button, index: number) => {
                this.initGamepadButtons(pad)
                this.initGamepadAxisRanges(pad)
            },
            this
        )
    }

    private initGamepadButtons(pad: Phaser.Input.Gamepad.Gamepad) {
        this.actionLB!.setGamepadButton(pad.buttons[4])
        this.actionRB!.setGamepadButton(pad.buttons[5])
        this.down!.setGamepadButton(pad.buttons[13])
        this.left!.setGamepadButton(pad.buttons[14])
        this.right!.setGamepadButton(pad.buttons[15])
        this.up!.setGamepadButton(pad.buttons[12])
    }

    private initGamepadAxisRanges(pad: Phaser.Input.Gamepad.Gamepad) {
        this.down!.setGamepadAxisRange(pad.axes[1], "gt", 0)
        this.left!.setGamepadAxisRange(pad.axes[0], "lt", 0)
        this.right!.setGamepadAxisRange(pad.axes[0], "gt", 0)
        this.up!.setGamepadAxisRange(pad.axes[1], "lt", 0)
    }
}

class VirtualKey {
    private curDownState: boolean
    private gamepadButton: Phaser.Input.Gamepad.Button | undefined
    private gamepadAxisRange: GamepadAxisRange | undefined
    private keyboardButton: Phaser.Input.Keyboard.Key | undefined
    private magnitude: number
    private prevDownState: boolean

    constructor(keyboardButton: Phaser.Input.Keyboard.Key) {
        this.keyboardButton = keyboardButton
        this.curDownState = false
        this.prevDownState = false
        this.magnitude = 0.0
    }

    public getMagnitude() {
        this.poll()
        return this.magnitude
    }

    public isDown() {
        this.poll()
        return this.curDownState
    }

    public isUniquelyDown() {
        this.poll()
        return this.curDownState && !this.prevDownState
    }

    public setGamepadButton(button: Phaser.Input.Gamepad.Button) {
        this.gamepadButton = button
    }

    public setGamepadAxisRange(axis: Phaser.Input.Gamepad.Axis, comparator: string, threshold: number) {
        this.gamepadAxisRange = new GamepadAxisRange(axis, comparator, threshold)
    }

    private poll() {
        const kbdButtonIsDown: boolean = this.keyboardButton === undefined ? false : this.keyboardButton.isDown
        const gpadButtonIsDown: boolean = this.gamepadButton === undefined ? false : this.gamepadButton.pressed
        const gpadStickIsDown: boolean =
            this.gamepadAxisRange === undefined ? false : this.gamepadAxisRange.valueInRange()

        const prev: boolean = this.curDownState
        const cur: boolean = kbdButtonIsDown || gpadButtonIsDown || gpadStickIsDown

        this.prevDownState = prev
        this.curDownState = cur

        if (gpadStickIsDown) {
            this.magnitude = this.gamepadAxisRange!.getMagnitude()
        } else if (this.isDown) {
            this.magnitude = 1.0
        } else {
            this.magnitude = 0.0
        }
    }
}

class GamepadAxisRange {
    private axis: Phaser.Input.Gamepad.Axis
    private comparator: string
    private threshold: number
    private value: number

    constructor(axis: Phaser.Input.Gamepad.Axis, comparator: string, threshold: number) {
        this.axis = axis
        this.comparator = comparator
        this.threshold = threshold
        this.value = 0.0
    }

    public getMagnitude() {
        this.poll()
        return Math.abs(this.value)
    }

    public valueInRange() {
        this.poll()

        let inRange: boolean = false

        switch (this.comparator) {
            case "lt": {
                inRange = this.value < this.threshold
                break
            }
            case "gt": {
                inRange = this.value > this.threshold
                break
            }
            case "le": {
                inRange = this.value <= this.threshold
                break
            }
            case "ge": {
                inRange = this.value >= this.threshold
                break
            }
            case "eq": {
                inRange = this.value === this.threshold
                break
            }
            case "ne": {
                inRange = this.value !== this.threshold
                break
            }
        }

        return inRange
    }

    private poll() {
        this.value = this.axis.getValue()
    }
}
