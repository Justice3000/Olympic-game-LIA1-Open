import {
  Bloom,
  EffectComposer,
  DepthOfField,
  Noise,
  Vignette,
} from "@react-three/postprocessing";

const PostProcessing = () => {
  return (
    <EffectComposer>
      <DepthOfField
        focusDistance={0}
        focalLength={3}
        bokehScale={2}
        height={480}
      />
      <Bloom luminanceThreshold={0.85} />
      <Noise opacity={0.02} />
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
  );
};

export default PostProcessing;
