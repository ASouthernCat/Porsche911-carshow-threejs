import * as resize from "./system/resize"
import * as THREE from "three"
import Stats from "stats.js"
import { createCamera } from "./base/camera"
import { createScene } from "./base/scene"
import { createCube } from "./base/cube"
import { createRenderer } from "./base/renderer"
// import { createComposer } from "./base/composer"
import { createControl } from "./base/control"
import { createLight } from "./base/light"
import { createModels } from "./main/model"
import { disposeTexture } from "./texture"
import { createDynamicEnv } from "./main/dynamicEnv"
import { gui } from "./system/gui"

const vector3 = new THREE.Vector3()

class ThreeApp {

    static instance

    static getInstance() {
        return ThreeApp.instance
    }

    constructor(container) {
        if (ThreeApp.instance) {
            return ThreeApp.instance
        }
        ThreeApp.instance = this

        // stat
        let stats = new Stats();
        stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(stats.dom);
        stats.dom.className = "stats"
        // stats.dom.style.display = 'none'
        this.stats = stats

        // console.log(container)
        console.log("场景初始化")
        // 相机 camera
        this.camera = createCamera()
        this.listener = new THREE.AudioListener()
        this.camera.add(this.listener)
        // 控制器
        this.control = createControl(this.camera, container)
        // 场景 scene
        this.scene = createScene()
        this.scene.userData.listener = this.listener
        // 渲染器 renderer
        this.renderer = createRenderer(container)
        // 后处理渲染器 composer
        // this.composer = createComposer(this.renderer, this.scene, this.camera)
        // 目标渲染
        this.renderTarget = new THREE.WebGLCubeRenderTarget(256)
        this.renderTarget.texture.type = THREE.HalfFloatType
        this.rtCubeCamera = new THREE.CubeCamera(1, 1000, this.renderTarget)
        this.rtCubeCamera.layers.set(1)
        this.scene.userData.rtCubeCameraLayer = 1
        this.scene.userData.dynamicMap = this.renderTarget.texture
        // 场景组成内容 object3D
        createModels(this.scene)
        // this.scene.add(createCube())
        createLight(this.scene)
        createDynamicEnv(this.scene)
        // resize
        resize.resizeEventListener(this.camera, this.renderer)
    }
    render() {
        // 渲染场景
        console.log("渲染场景...")
        const clock = new THREE.Clock()
        let previousTime = 0
        this.tick = () => {
            this.stats.update()
            const elapsedTime = clock.getElapsedTime()
            const deltaTime = elapsedTime - previousTime
            previousTime = elapsedTime

            // // Update controls
            this.control.update()

            this.camera.position.lerp(vector3.set( 0.05 * Math.sin(elapsedTime), 0,  0.01 * Math.cos(elapsedTime)).add(this.camera.position), 0.05)

            // console.log(this.camera.position,this.control.target)

            // Update dynamic-env
            this.scene.userData.dynamicEnv && this.scene.userData.dynamicEnv.children.forEach(item => {
                if (item.userData.update) {
                    item.userData.update(deltaTime, elapsedTime)
                }
            })
            this.scene.background.b = 0.02 * Math.sin(elapsedTime) + 0.04

            // rtCubeCamera
            this.rtCubeCamera.update(this.renderer, this.scene)

            // Render
            this.renderer.render(this.scene, this.camera)
            // this.composer.render()

            // Call tick again on the next frame
            this.tickId = window.requestAnimationFrame(this.tick)
        }
        this.tick()
    }
    clear() {
        console.log("清理内存")
        // location.reload()
        resize.clear()
        document.body.removeChild(this.stats.dom)
        cancelAnimationFrame(this.tickId)
        this.tick = null
        this.scene.traverse(child => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose()
                child.material.dispose()
            }
        })
        this.scene = null
        this.camera = null
        this.renderer.dispose()
        this.control.dispose()
        disposeTexture()
        gui.children.forEach(h => { h.domElement.remove() })
    }
}

export { ThreeApp }