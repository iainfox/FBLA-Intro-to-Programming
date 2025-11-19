import Sprite from "./Sprite"

export default class Broadcaster {
    sprites: Sprite[]
    
    /**
     * Broadcast a message to all sprites
     */
    public broadcast(broadcast_name: string) {
        this.sprites.forEach(sprite => {
            sprite.recieve_broadcast(broadcast_name)
        });
    }
}