import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { Model3D } from '../types';

interface Model3DViewerProps {
  model: Model3D;
  onLoaded?: () => void;
  onError?: (error: string) => void;
}

export const Model3DViewer: React.FC<Model3DViewerProps> = ({
  model,
  onLoaded,
  onError,
}) => {
  const webViewRef = useRef<WebView>(null);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { margin: 0; overflow: hidden; background: #000; }
        canvas { display: block; width: 100%; height: 100%; }
        #loading { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; }
      </style>
    </head>
    <body>
      <div id="loading">Loading 3D Model...</div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/three@r128/examples/js/loaders/GLTFLoader.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/three@r128/examples/js/controls/OrbitControls.js"></script>
      <script>
        let scene, camera, renderer, controls, model;

        function init() {
          // Scene setup
          scene = new THREE.Scene();
          scene.background = new THREE.Color(0x1a1a1a);

          // Camera setup
          camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
          );
          camera.position.z = 5;

          // Renderer setup
          renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
          renderer.setSize(window.innerWidth, window.innerHeight);
          renderer.setPixelRatio(window.devicePixelRatio);
          document.body.appendChild(renderer.domElement);

          // Lighting
          const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
          scene.add(ambientLight);

          const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
          directionalLight.position.set(5, 5, 5);
          scene.add(directionalLight);

          // Controls
          controls = new THREE.OrbitControls(camera, renderer.domElement);
          controls.enableDamping = true;
          controls.dampingFactor = 0.05;
          controls.autoRotate = true;
          controls.autoRotateSpeed = 2;

          // Load model
          loadModel();

          // Handle window resize
          window.addEventListener('resize', onWindowResize);

          // Start animation loop
          animate();
        }

        function loadModel() {
          const loader = new THREE.GLTFLoader();
          loader.load(
            '${model.url}',
            (gltf) => {
              model = gltf.scene;
              scene.add(model);

              // Center and scale model
              const box = new THREE.Box3().setFromObject(model);
              const center = box.getCenter(new THREE.Vector3());
              const size = box.getSize(new THREE.Vector3());
              const maxDim = Math.max(size.x, size.y, size.z);
              const scale = 4 / maxDim;

              model.position.sub(center.multiplyScalar(scale));
              model.scale.multiplyScalar(scale);

              document.getElementById('loading').style.display = 'none';
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'loaded' }));
            },
            (progress) => {
              const percent = (progress.loaded / progress.total) * 100;
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ type: 'progress', percent })
              );
            },
            (error) => {
              console.error('Error loading model:', error);
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ type: 'error', message: error.message })
              );
            }
          );
        }

        function animate() {
          requestAnimationFrame(animate);
          controls.update();
          renderer.render(scene, camera);
        }

        function onWindowResize() {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        }

        init();
      </script>
    </body>
    </html>
  `;

  const handleMessage = (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.type === 'loaded') {
        onLoaded?.();
      } else if (message.type === 'error') {
        onError?.(message.message);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        onMessage={handleMessage}
        style={styles.webView}
        scalesPageToFit={true}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  webView: {
    flex: 1,
  },
});
