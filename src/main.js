import { ThreeApp } from "./threejs/ThreeApp";

onload = () => {
    // 创建一个ThreeApp实例
    const threeApp = new ThreeApp(document.getElementById("webgl"));

    // 启动ThreeApp实例
    threeApp.render();
}

onbeforeunload = () => {
    // 清理ThreeApp实例
    ThreeApp.getInstance().clear();
}