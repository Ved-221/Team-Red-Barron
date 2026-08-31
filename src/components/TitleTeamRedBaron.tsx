"use client";

import DepthText from "@/components/ui/DepthText";

export function TitleTeamRedBaron() {
  const fontFamily = "'Planet Kosmos', sans-serif";
  const fontSize = "clamp(2.5rem, 6.5vw, 5.5rem)";

  return (
    <div className="homepage-title inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 my-4 select-none">
      <DepthText
        text="TEAM"
        faceColor="#ffffff"
        depthColor="#38393a"
        fontFamily={fontFamily}
        fontSize={fontSize}
        fontWeight={900}
        layers={30}
        depth={2}
        tilt={5}
        autoOrbit={true}
        orbitSpeed={0.3}
        className="tracking-[0.25em]"
      />
      <DepthText
        text="RED"
        faceColor="#de1615"
        depthColor="#690002"
        fontFamily={fontFamily}
        fontSize={fontSize}
        fontWeight={900}
        layers={30}
        depth={2.2}
        tilt={5}
        autoOrbit={true}
        orbitSpeed={0.3}
        className="tracking-[0.25em]"
      />
      <DepthText
        text="BARON"
        faceColor="#ffffff"
        depthColor="#38393a"
        fontFamily={fontFamily}
        fontSize={fontSize}
        fontWeight={900}
        layers={30}
        depth={2}
        tilt={5}
        autoOrbit={true}
        orbitSpeed={0.3}
        className="tracking-[0.25em]"
      />
    </div>
  );
}
