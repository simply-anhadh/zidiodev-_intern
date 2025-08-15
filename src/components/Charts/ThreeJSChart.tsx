import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeJSChartProps {
  data: any[];
  xAxis: string;
  yAxis: string;
}

const ThreeJSChart: React.FC<ThreeJSChartProps> = ({ data, xAxis, yAxis }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Create 3D columns
    const maxValue = Math.max(...data.map(item => item[yAxis]));
    const colors = [0x3b82f6, 0x10b981, 0xf59e0b, 0xef4444, 0x8b5cf6];

    data.slice(0, 10).forEach((item, index) => {
      const height = (item[yAxis] / maxValue) * 5;
      const geometry = new THREE.BoxGeometry(0.8, height, 0.8);
      const material = new THREE.MeshLambertMaterial({ 
        color: colors[index % colors.length] 
      });
      const column = new THREE.Mesh(geometry, material);
      
      column.position.set(
        (index - 4.5) * 1.5,
        height / 2,
        0
      );
      column.castShadow = true;
      column.receiveShadow = true;
      
      scene.add(column);

      // Add text labels (simplified)
      const textGeometry = new THREE.PlaneGeometry(1, 0.3);
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 64;
      const context = canvas.getContext('2d')!;
      context.fillStyle = '#374151';
      context.font = 'bold 20px Arial';
      context.textAlign = 'center';
      context.fillText(String(item[xAxis]).slice(0, 8), 128, 40);
      
      const texture = new THREE.CanvasTexture(canvas);
      const textMaterial = new THREE.MeshBasicMaterial({ 
        map: texture, 
        transparent: true 
      });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set((index - 4.5) * 1.5, -1, 0);
      textMesh.rotation.x = -Math.PI / 2;
      scene.add(textMesh);
    });

    // Grid
    const gridHelper = new THREE.GridHelper(20, 20, 0xcccccc, 0xcccccc);
    scene.add(gridHelper);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Rotate the scene slowly
      scene.rotation.y += 0.005;
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Mouse controls (simple rotation)
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (event: MouseEvent) => {
      if (!mountRef.current) return;
      mouseX = (event.clientX / mountRef.current.clientWidth) * 2 - 1;
      mouseY = -(event.clientY / mountRef.current.clientHeight) * 2 + 1;
      
      camera.position.x = Math.sin(mouseX * Math.PI) * 15;
      camera.position.z = Math.cos(mouseX * Math.PI) * 15;
      camera.position.y = mouseY * 10 + 10;
      camera.lookAt(0, 0, 0);
    };

    mountRef.current.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeEventListener('mousemove', handleMouseMove);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [data, xAxis, yAxis]);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full rounded-lg overflow-hidden bg-gray-50"
      style={{ minHeight: '400px' }}
    />
  );
};

export default ThreeJSChart;