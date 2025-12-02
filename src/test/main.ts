import Sprite from '../ts/Sprite.js'
import Game from '../ts/Game.js'

const canvas = document.getElementById("a") as HTMLCanvasElement | null;
if (!canvas) throw new Error("Canvas element with id 'a' not found.");

const image = new Image();
const loadPromise = new Promise<void>((resolve, reject) => {
	image.onload = () => resolve();
	image.onerror = reject;
	image.src = "../../temp.jpg";
});
await loadPromise;

const image2 = new Image();
const load2Promise = new Promise<void>((resolve, reject) => {
	image2.onload = () => resolve();
	image2.onerror = reject;
	image2.src = "../../temp.jpg";
});
await load2Promise;

const sprite = new Sprite(image, "costume1");
sprite.set_size_to_x(20);
const game = new Game(new Sprite(image2, "backdrop1"), canvas);

game.add_sprite(sprite);
game.render();