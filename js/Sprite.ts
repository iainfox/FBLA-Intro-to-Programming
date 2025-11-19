export default class Sprite {
    sprite: HTMLImageElement
    touching_mouse: boolean
    on_click: Function
    direction: number
    position: [number, number]

    constructor(img: HTMLImageElement) {
        this.sprite = img

        const rect = this.sprite.getBoundingClientRect()

        const width = this.sprite.offsetWidth
        const height = this.sprite.offsetHeight
        this.sprite.style.position = "absolute"
        this.sprite.style.transform = "translate(-50%, -50%)"

        const x = rect.left + width / 2
        const y = rect.top + height / 2

        this.position = [x, y]

        this.sprite.style.left = `${x}px`
        this.sprite.style.top = `${y}px`

        this.direction = 90

        this.sprite.addEventListener('mouseenter', () => {
            this.touching_mouse = true
        })
        this.sprite.addEventListener('mouseleave', () => {
            this.touching_mouse = false
        })
        this.sprite.addEventListener('mouseclick', () => {
            if (this.on_click) {
                this.on_click();
            }
        })
    }

    public set set_on_click(v : Function) {
        this.on_click = v
    }
    
    public get isTouchingMousePointer() : boolean {
        return this.touching_mouse
    }

    private update_rotation() {
        this.sprite.style.rotate = `${this.direction}`
    }

    public set turn_x_degrees_clockwise(degrees: number) {
        this.direction += degrees
        this.update_rotation()
    }

    public set turn_x_degrees_counter_clockwise(degrees: number) {
        this.direction -= degrees
        this.update_rotation()
    }

    public set point_in_direction(degrees: number) {
        this.direction = degrees
        this.update_rotation()
    }

    /**
     * Moves the sprite x amount of steps (10px) in the direction the sprite is facing
     * 
     * @param {number} steps
     * the number of steps to take
     */
    public move_x_steps(steps: number) {
        const x = Math.cos(-this.direction)* (steps*10)
        const y = Math.sin(-this.direction)* (steps*10)
        this.position = [x, y]
        this.sprite.style.left = `${x}`
        this.sprite.style.top = `${y}`
    }

    /**
     * Sets the x and y position on the screen to the provided values
     * 
     * @param {number} x
     * the x position on the screen to move the sprite to
     * @param {number} y
     * the y position on the screen to move the sprite to
     */
    public go_to_xy(x: number, y: number) {
        this.position = [x, y]
        this.sprite.style.left = `${x}`
        this.sprite.style.top = `${y}`
    }
}