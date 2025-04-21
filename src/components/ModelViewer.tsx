
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";

type Props = {
  glbUrl: string;
  loading: boolean;
};

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

const ModelViewer: React.FC<Props> = ({ glbUrl, loading }) => {
  return (
    <div className="w-full h-[380px] bg-gray-100 rounded-xl border my-6 flex items-center justify-center">
      <Canvas camera={{ position: [0, 1.2, 3.5], fov: 50 }}>
        <ambientLight intensity={0.85} />
        <directionalLight position={[0, 5, 5]} intensity={1.2} />
        <Suspense fallback={null}>
          {!loading && glbUrl && <Model url={glbUrl} />}
          <Environment preset="city" />
        </Suspense>
        <OrbitControls autoRotate enablePan enableZoom />
      </Canvas>
    </div>
  );
};

export default ModelViewer;
