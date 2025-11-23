import Sprite from './ts/Sprite.js'

const image = document.getElementById('temp') as HTMLImageElement | null
if (!image) {
	throw new Error('Image element with id "temp" not found')
}

const sprite = new Sprite(image, "costume1")
sprite.go_to_xy(0, 0)
const sprite2 = sprite.create_clone()

let mouseX = 0;
let mouseY = 0;

window.onmousemove = (event: MouseEvent) => {
	const centerX = window.innerWidth / 2;
	const centerY = window.innerHeight / 2;
	mouseX = event.clientX - centerX;
	mouseY = centerY - event.clientY;
	
	sprite.point_in_direction_xy(mouseX, mouseY);
	sprite2.point_in_direction_xy(-mouseX, mouseY)
};

window.onmouseup = (event: MouseEvent) => {
	if (event.button === 0) {
		sprite.change_size_by_x(10);
	} else if (event.button === 2) {
		sprite.change_size_by_x(-10);
	}
};

window.oncontextmenu = (e) => {
	e.preventDefault();
};