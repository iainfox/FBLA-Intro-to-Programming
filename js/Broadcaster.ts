import Sprite from "./Sprite"

export default class Broadcaster {
    sprites: Sprite[]
    
    /**
     * Broadcasts the specified message to all sprites.
     * 
     * @param {string} broadcast_name
     * The name of the broadcast message to send.
     */
    public broadcast(broadcast_name: string) {
        this.sprites.forEach(sprite => {
            sprite.recieve_broadcast(broadcast_name)
        });
    }
}