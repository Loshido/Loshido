export default async () => {
	if (window.innerWidth >= 640) {
		const canvas = document.querySelector("canvas")
		if(!canvas) throw new Error("canvas is not defined")
		const { mount } = await import("ascii.rest")

		const oceanSunset = () => import("ascii.rest/pieces/ocean-sunset")
		const kyotoDusk = () => import("ascii.rest/pieces/kyoto-dusk")
		const tokyoRain = () => import("ascii.rest/pieces/tokyo-rain")
		const pieces = [oceanSunset, kyotoDusk, tokyoRain]
		const index = Math.floor(Math.random() * pieces.length)
		const piece = await pieces[index]()

		mount(canvas, piece, { motion: true, fps: 30 })
	}
}
