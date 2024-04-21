import { sizes } from "./sizes"
let camera,renderer,composer
function resizeEvent() {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    composer && composer.setSize(sizes.width, sizes.height)

}
export function resizeEventListener(_camera,_renderer,_composer = null){
    camera = _camera; renderer = _renderer; composer = _composer;
    window.addEventListener('resize', resizeEvent)
}
export function clear(){
    window.removeEventListener("resize", resizeEvent)
}
