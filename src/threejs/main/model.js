import { gui, debugObject } from '../system/gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { ReflectorForSSRPass } from "three/examples/jsm/objects/ReflectorForSSRPass";
import { ssrPass } from '../base/composer';
import * as THREE from 'three'
import { SSRPass } from 'three/examples/jsm/postprocessing/SSRPass';
import isMobileDevice from '../utils/deviceType';

let scene = new THREE.Scene()
const loadingManager = new THREE.LoadingManager(
    // Loaded
    () => {
        console.log('Loaded successfully!')
        setTimeout(() => {
            document.querySelector(".loader-container").classList.add("loaded")
            document.querySelector(".loader").setAttribute("style", "  border-right-color: #0000;")
        }, 1500);
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
        addEventListener("touchend", () => {
            !positionalAudio.isPlaying && positionalAudio.play();
        })
    });

    /*
Author: Karol Miklas (https://sketchfab.com/karolmiklas)
License: CC-BY-SA-4.0 (http://creativecommons.org/licenses/by-sa/4.0/)
Source: https://sketchfab.com/3d-models/free-porsche-911-carrera-4s-d01b254483794de3819786d93e0e1ebf
Title: (FREE) Porsche 911 Carrera 4S
*/
    // 加载器解析模型
    gltfLoader.load(import.meta.env.BASE_URL + '911-draco.glb',
        (glb) => {
            const carModel = glb.scene
            carModel.name = "911"
            carModel.add(positionalAudio)
            scene.add(carModel)
            carModel.position.y += 0.63

            console.log('carModel', carModel)
            updateAllMaterials()

            gui.close()
        }
    )

    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(5, 6),
        new THREE.MeshStandardMaterial({
            color: '#7780a6',
            roughness: 0.2,
            metalness: 0.8,
            side: THREE.FrontSide,
            envMap: scene.userData.dynamicMap,
            envMapIntensity: 0.8,
        })
    )
    ground.layers.enable(scene.userData.rtCubeCameraLayer)
    ground.receiveShadow = true
    ground.rotation.set(-Math.PI * 0.5, 0, 0)
    ground.position.set(0, 0, 0)
    scene.add(ground)

    let isUseDepthTexture = true
    if (isMobileDevice()) {
        isUseDepthTexture = false
    }
    const groundReflector = new ReflectorForSSRPass(new THREE.PlaneGeometry(5, 6), {
        clipBias: 0.0003,
        textureWidth: window.innerWidth,
        textureHeight: window.innerHeight,
        color: 0x888888,
        useDepthTexture: isUseDepthTexture,
    });
    groundReflector.material.depthWrite = true;
    groundReflector.rotation.set(- Math.PI * 0.5, 0, 0);
    groundReflector.position.set(0, 0.01, 0)
    groundReflector.visible = false;
    ssrPass.groundReflector = groundReflector
    scene.add(groundReflector);
    // setting
    ground.renderOrder = 1
    groundReflector.renderOrder = 2
    groundReflector.fresnel = ssrPass.fresnel = true;
    groundReflector.distanceAttenuation = ssrPass.distanceAttenuation = true;
    ssrPass.maxDistance = 1.3;
    groundReflector.maxDistance = ssrPass.maxDistance;
    ssrPass.opacity = 0.55;
    groundReflector.opacity = ssrPass.opacity;

    // debug
    debugObject.paintColor = '#b3b3ff'
    gui.addColor(debugObject, 'paintColor').onChange(() => {
        updateAllMaterials()
    })
    gui.add(ground, 'visible').name('Ground Visible')
    // gui.add(ground.position, 'y').min(-10).max(10).step(0.001).name('Ground Y')
    // gui.addColor(ground.material, 'color').name('Ground Color')
    // gui.add(ground.material, 'roughness').min(0).max(1).step(0.001).name('Ground Roughness')
    // gui.add(ground.material, 'metalness').min(0).max(1).step(0.001).name('Ground Metalness')
    // gui.add(ground.material, 'envMapIntensity').min(0).max(10).step(0.001).name('Ground EnvMapIntensity')
}

/**
 * 材质更新调整
 */
function updateAllMaterials() {

    scene.getObjectByName('911').traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.castShadow = true
            child.receiveShadow = true
            // child.material.envMap = TEXTURE.envMap
            child.material.envMap = scene.userData.dynamicMap
            // ssrPass.selects.push(child)

            // console.log(child.material.name)

            if (child.material.name === 'rubber') {
                child.material.color.set('#222')
                child.material.roughness = 1
                child.material.normalScale.set(4, 4)
                child.material.envMap = scene.userData.dynamicMap
            }
            if (child.material.name === 'window') {
                child.material.color.set('#222')
                child.material.roughness = 0
                child.material.clearcoat = 0.1
                child.material.envMap = scene.userData.dynamicMap
            }
            if (child.material.name === 'coat') {
                child.material.envMapIntensity = 4
                child.material.roughness = 0.5
                child.material.metalness = 1
                child.material.envMap = scene.userData.dynamicMap
            }
            if (child.material.name === 'paint') {
                child.material.envMapIntensity = 2
                child.material.roughness = 0.45
                child.material.metalness = 0.8
                child.material.envMap = scene.userData.dynamicMap
                child.material.color.set(debugObject.paintColor)
            }
        }
    })

    // 更新阴影
    scene.getObjectByProperty('type', 'SpotLight').shadow.needsUpdate = true
}

export { createModels, updateAllMaterials }
