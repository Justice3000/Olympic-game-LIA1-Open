import { GLTF } from "three-stdlib";

declare global {//FIX FOR useGLTF missing types
  type DreiGLTF = GLTF & {
    nodes: Record<string, THREE.Mesh>;
    materials: Record<string, THREE.MeshStandardMaterial>;
    skeleton: any;
  };
}

