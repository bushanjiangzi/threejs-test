// import * as THREE from 'three'

// 代表子线程自身，即子线程的全局对象。self.addEventListener()指定监听函数，也可以使用self.onmessage指定。
// Worker 内部如果要加载其他脚本，有一个专门的方法importScripts()。
self.addEventListener('message', function(e) {
  importScripts('module/loaders/three.js', 'module/loaders/GLTFLoader.js', 'module/loaders/DRACOLoader.js');
  console.log("webwork")
  var dbname = "module"
  loadgltf(new THREE.Scene())
}, false);

function loadgltf(scene) {
  var onProgress = function(xhr) {
    if (xhr.lengthComputable) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
  };
  var gltfloader = new THREE.GLTFLoader()
  gltfloader.setDRACOLoader(new THREE.DRACOLoader());
  gltfloader.load('luyu2.gltf', function(gltf) {
    console.log('webwork gltfloader')
    var object = gltf.scene
    var objBbox = new THREE.Box3().setFromObject(gltf.scene);
    var bboxCenter = objBbox.getCenter().clone();
    bboxCenter.multiplyScalar(-1);

    object.traverse(function(child) { //转换成threejs对象
        if (child instanceof THREE.Mesh) {
            child.geometry.translate(bboxCenter.x, bboxCenter.y, bboxCenter.z);
        }
    });
    objBbox.setFromObject(object); // Update the bounding box
    scene.add(object);
    console.log(scene)
    console.log('webwork send scene')
    // self.postMessage()方法用来向主线程发送消息
    self.postMessage(JSON.stringify(scene.toJSON()))
  }, onProgress);
}