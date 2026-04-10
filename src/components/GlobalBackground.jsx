import React from "react";
import { useLocation } from "react-router-dom";
import AnoAI from "./ui/animated-shader-background";

const GlobalBackground = () => {
    const location = useLocation();

    // Do not render the AnoAI background on the landing page
    if (location.pathname === "/") {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none">
            <AnoAI />
            <div className="absolute inset-0 bg-[#0a0a0a]/60 backdrop-blur-[2px]" />
        </div>
    );
};

export default GlobalBackground;
