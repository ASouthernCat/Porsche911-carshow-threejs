import { gui, debugObject } from '../system/gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import * as THREE from 'three'

let scene = new THREE.Scene()
const loadingManager = new THREE.LoadingManager(
    // Loaded
    () => {
        console.log('Loaded successfully!')
    },
    // Progress
    (itemUrl, itemsLoaded, itemsTotal) => {
        let progressRatio = itemsLoaded / itemsTotal
        let p = (progressRatio * 100).toFixed(0)
        // console.log('progress:',p.value,'%')
    }
)
const gltfLoader = new GLTFLoader(loadingManager)
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath(import.meta.env.BASE_URL + 'draco/')
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * 
 * @param {THREE.Scene} _scene 
 */
function createModels(_scene) {
    scene = _scene

    // 背景音
    const positionalAudio = new THREE.PositionalAudio(scene.userData.listener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(import.meta.env.BASE_URL + 'bg0.mp3', function (buffer) {
        positionalAudio.setBuffer(buffer);
        positionalAudio.setRefDistance(3);

        // 浏览器安全策略，须用户进行交互才可播放音频
        addEventListener("click", () => {
            !positionalAudio.isPlaying && positionalAudio.play();
        })
    });

    // 加载器解析模型
    gltfLoader.load(import.meta.env.BASE_URL + '911-draco.glb',
        (glb) => {
            const carModel = glb.scene
            carModel.name = "911"
            carModel.add(positionalAudio)
            scene.add(carModel)

            console.log('carModel', carModel)
            updateAllMaterials()

            gui.close()
        }
    )

    // debug
    debugObject.paintColor = '#b3b3ff'
    gui.addColor(debugObject, 'paintColor').onChange(() => {
        updateAllMaterials()
    })
}

/**
 * 材质更新调整
 */
function updateAllMaterials() {

    scene.getObjectByName('911').traverse((child) => {
        if (child instanceof THREE.Mesh) {
            // child.castShadow = true
            // child.receiveShadow = true
            // child.material.envMap = TEXTURE.envMap
            child.material.envMap = scene.userData.dynamicMap

            // console.log(child.material.name)

            if(child.material.name === 'rubber'){
                child.material.color.set('#222')
                child.material.roughness = 1
                child.material.normalScale.set(4,4)
                child.material.envMap = scene.userData.dynamicMap
            }
            if(child.material.name === 'window'){
                child.material.color.set('#222')
                child.material.roughness = 0
                child.material.clearcoat = 0.1
                child.material.envMap = scene.userData.dynamicMap
            }
            if(child.material.name === 'coat'){
                child.material.envMapIntensity = 4
                child.material.roughness = 0.5
                child.material.metalness = 1
                child.material.envMap = scene.userData.dynamicMap
            }
            if(child.material.name === 'paint'){
                child.material.envMapIntensity = 2
                child.material.roughness = 0.45
                child.material.metalness = 0.8
                child.material.envMap = scene.userData.dynamicMap
                child.material.color.set(debugObject.paintColor)
            }
        }
    })
}

export { createModels, updateAllMaterials }
