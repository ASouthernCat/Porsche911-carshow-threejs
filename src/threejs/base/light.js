import { AmbientLight, SpotLight } from 'three'
import { gui } from '../system/gui'
import Style from '../system/style'

/**
 * 添加光源，含环境光、平行光等
 * @param {Scene} scene 
 */
function createLight(scene) {
    // 点光源
    // const pointLight = new SpotLight(0xffffff, 2, 0, 0.3, 1)
    // pointLight.position.set(0, 15, 0)
    // pointLight.castShadow = true
    // pointLight.shadow.bias = -0.0001
    // scene.add(pointLight)
    // 环境光
    const ambientLight = new AmbientLight(0xffffff, 0.5)
    ambientLight.intensity = Style.default.ambientLightIntensity
    ambientLight.name = 'ambientLight'
    scene.add(ambientLight)
}

export { createLight };