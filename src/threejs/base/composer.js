import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
// import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass'
import { SSRPass } from 'three/examples/jsm/postprocessing/SSRPass';
import * as THREE from 'three';
import { sizes } from "../system/sizes";
// import { gui } from "../system/gui";

const parameters = {
    bloomStrength: 0.3,
    bloomThreshold: 0.1,
    bloomRadius: 0.6,
}

let ssrPass = null

function initComposer(renderer, scene, camera) {
    const renderScene = new RenderPass(scene, camera);
    // 辉光处理通道
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5,
        0.4,
        0.85
    );
    bloomPass.threshold = parameters.bloomThreshold;
    bloomPass.strength = parameters.bloomStrength;
    bloomPass.radius = parameters.bloomRadius;
    // 抗锯齿处理通道
    const fxaaPass = new ShaderPass(FXAAShader);
    const pixelRatio = renderer.getPixelRatio();
    fxaaPass.material.uniforms['resolution'].value.x = 1 / (sizes.width * pixelRatio);
    fxaaPass.material.uniforms['resolution'].value.y = 1 / (sizes.height * pixelRatio);
    // smaapass
    // const smaaPass = new SMAAPass(window.innerWidth * pixelRatio, window.innerHeight * pixelRatio);
    // ssrpass
    ssrPass = new SSRPass({
        renderer,
        scene,
        camera,
        width: innerWidth,
        height: innerHeight,
        groundReflector: null,
        selects: []
    });
    // 输出
    const outputPass = new OutputPass();
    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(ssrPass)
    composer.addPass(bloomPass);
    // composer.addPass(smaaPass)
    composer.addPass(outputPass)
    composer.addPass(fxaaPass)

    // debug
    // gui
    //     .add(parameters, "bloomStrength")
    //     .onChange((v) => {
    //         bloomPass.strength = v;
    //     })
    //     .step(0.1);
    // gui
    //     .add(parameters, "bloomRadius")
    //     .onChange((v) => {
    //         bloomPass.radius = v;
    //     })
    //     .step(0.1);
    // gui
    //     .add(parameters, "bloomThreshold")
    //     .onChange((v) => {
    //         bloomPass.threshold = v;
    //     })
    //     .step(0.1);

    return composer
}

export { initComposer, ssrPass }