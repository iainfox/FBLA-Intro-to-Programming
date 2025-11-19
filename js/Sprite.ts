export default class Sprite {
    sprite: HTMLImageElement
    touching_mouse: boolean
    on_click: Function

    constructor(img: HTMLImageElement) {
        this.sprite = img

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
}