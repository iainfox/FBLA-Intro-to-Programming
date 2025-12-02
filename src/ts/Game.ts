import Sprite from 'Sprite'

export default class Game {
    private backdrop: Sprite
    private sprite_list: Sprite[] = []
    private canvas: HTMLCanvasElement
    private canvas_context: CanvasRenderingContext2D | null

    constructor (backdrop: Sprite, canvas: HTMLCanvasElement) {
        this.backdrop = backdrop
        this.canvas = canvas
        this.canvas_context = this.canvas.getContext("2d")

        this.canvas.addEventListener('click', (e: MouseEvent) => {
            const rect = this.canvas.getBoundingClientRect()
            const mouseX = e.clientX - rect.left
            const mouseY = e.clientY - rect.top

            for (const sprite of this.sprite_list) {
                if (sprite.isHidden) continue

                const sprite_image = sprite.get_current_costume_image();
                if (sprite_image) {
                    const sprite_width = sprite_image.width;
                    const sprite_height = sprite_image.height;

                    const left = sprite.Position.x - sprite_width / 2;
                    const right = sprite.Position.x + sprite_width / 2;
                    const top = sprite.Position.y - sprite_height / 2;
                    const bottom = sprite.Position.y + sprite_height / 2;

                    if (
                        mouseX >= left &&
                        mouseX <= right &&
                        mouseY >= top &&
                        mouseY <= bottom
                    ) {
                        sprite.onClickCallbacks.forEach(callback => {
                            callback()
                        });
                    }
                }
            }
        })
    }
    
    /**
     * Broadcasts the specified message to all sprites.
     * 
     * @param {string} broadcast_name
     * The name of the broadcast message to send.
     */
    public broadcast(broadcast_name: string) {
        if (!this.sprite_list) return
        this.sprite_list.forEach(sprite => {
            sprite.recieve_broadcast(broadcast_name)
        });
    }

    /**
     * Adds a new backdrop image to the backdrop.
     * 
     * @param {string} backdrop_name
     * the name of the backdrop
     * @param {string} image_url
     * the URL of the backdrop image
     */
    public add_backdrop(backdrop_name: string, image_url: string) {
        this.backdrop.add_costume(backdrop_name, image_url)
    }

    /**
     * Switches the backdrop's iamge to the given backdrop name if it exists.
     * 
     * @param {string} backdrop_name
     * The name of the backdrop to switch to.
     */
    public switch_bostume(backdrop_name: string) {
        this.backdrop.switch_costume(backdrop_name)
    }

    /**
     * Adds a sprite to the game's sprite list
     * 
     * @param {Sprite} sprite
     * The sprite object to add
     */
    public add_sprite(sprite: Sprite) {
        this.sprite_list.push(sprite)
    }

    /**
     * Converts user coordinates (center-origin, Y-down) to CSS coordinates (top-left origin).
     * 
     * @param {number} userX - The x coordinate in user (center-origin) space.
     * @param {number} userY - The y coordinate in user (center-origin) space.
     * @returns {{css_x: number, css_y: number}} The equivalent CSS coordinates (top-left origin).
     * 
     */
    public userToCss(userX: number, userY: number): {css_x: number, css_y: number} {
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2
        const css_x = centerX + userX
        const css_y = centerY - userY
        return {css_x, css_y}
    }

    /**
     * Updates every sprite in the sprite list.
     */
    public render() {
        if (!this.canvas_context) return
        const ctx = this.canvas_context

        for (const sprite of this.sprite_list) {
            if (sprite.isHidden) continue
            const sprite_image = sprite.get_current_costume_image()
            if (sprite_image) {
                ctx.filter = `brightness(${(sprite.Brightness+100)/2}%) hue-rotate(${sprite.Color}deg) opacity(${sprite.Ghost}%)`

                const {css_x, css_y} = this.userToCss(sprite.Position.x, sprite.Position.y)

                // Draw sprite
                const drawWidth = sprite_image.width * (sprite.Scale / 100)
                const drawHeight = sprite_image.height * (sprite.Scale / 100)
                ctx.drawImage(
                    sprite_image,
                    css_x - drawWidth / 2,
                    css_y - drawHeight / 2,
                    drawWidth,
                    drawHeight
                )

                ctx.filter = ``
            }
        }
    }
}