import Sprite from 'Sprite'

export default class Game {
    private backdrop: Sprite

    constructor (backdrop: Sprite) {
        this.backdrop = backdrop
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
}