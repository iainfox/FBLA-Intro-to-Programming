export default class Sprite {
    sprite: HTMLImageElement
    touching_mouse: boolean
    on_click: Function
    direction: number

    constructor(img: HTMLImageElement) {
        this.sprite = img
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
}