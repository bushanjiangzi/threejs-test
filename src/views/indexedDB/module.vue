<template>
  <div>
    <div>show module</div>
  </div>
</template>

<script>
export default {
  name: 'module',
  data() {
    return {

    }
  },
  mounted() {
    var container, obj, db, dbname = "module",
        intflag;
    var mouseFlag = true
    var camera, scene, renderer;
    createDb()

    function createDb() {
      var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
      var request = indexedDB.open(dbname, '1');
      request.onsuccess = function(e) {
        db = e.target.result;
        intervalModel()
      };
    }

    function intervalModel() {
      intflag = setInterval(showModel, 1000)
    }

    function showModel() {
      var a = new Date().getTime() / 1000
      var store = db.transaction(dbname, 'readwrite').objectStore(dbname)
      var req = store.get(1)
      req.onsuccess = function(event) {
        if (req.result == null) {
          console.log("no data")
        } else {
          new THREE.ObjectLoader().parse(req.result["content"], function(e) {
            console.log(e)
            init()
            scene.add(e.children[0])
            console.log(scene)
            obj = scene.children[2]
            obj.rotation.set(5, 0, 3)
            obj.scale.set(0.5, 0.5, 0.5)
            // container.addEventListener('mousemove', onDocumentMouseMove, false);
            console.log((new Date().getTime() / 1000) - a + " s")
          }, '.');
          clearInterval(intflag)
        }
      }
      req.onerror = function(event) {
        console.log(event)
      }
    }

    function onDocumentMouseMove(event) {
      var vector = new THREE.Vector3(((event.clientX - 100) / container.clientWidth) * 2 - 1, -((event.clientY - 100) / container.clientHeight) * 2 + 1, 0.5);
      vector = vector.unproject(camera);
      console.log(vector)
      var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
      var intersects = raycaster.intersectObjects(obj.children, true);
      console.log(intersects.length)
      if (intersects.length > 0) {
        console.log(intersects[0].object);
        mouseFlag = false
        // intersects[0].object.material.color.set(0xffff00);
        // intersects[0].object.material.transparent = true;
        // intersects[0].object.material.opacity = 0.1;
      } else {
        mouseFlag = true
      }
    }

    function init() {
      scene = new THREE.Scene();
      // document.addEventListener('mousemove', onDocumentMouseMove, false);
      container = document.getElementById("WebGL-output")
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
      camera.position.set(150, 150, 150)
      var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
      scene.add(ambientLight);
      pointLight = new THREE.PointLight(0xffffff, 0.8);
      scene.add(pointLight);
      camera.add(pointLight);
      scene.add(camera);
      camera.lookAt(scene.position);
      renderer = new THREE.WebGLRenderer();
      renderer.setClearColor(new THREE.Color(0xcccccc));
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);
      animate()
    }

    function animate() {
      requestAnimationFrame(animate);
      render();
    }
    function render() {
      if (obj && mouseFlag) {
        // obj.rotation.z += 0.01
      }
      renderer.render(scene, camera);
    }
  },
  methods:{
    login() {
      console.log('login...')
    }
  }
}
</script>

<style>

</style>