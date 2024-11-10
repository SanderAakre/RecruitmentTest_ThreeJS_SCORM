'use client'

import React from "react";
import ThreeScene from "@/components/ThreeScene";
import Script from "next/script";

export default function Home() {
  return (
    <div className="h-screen w-screen">
      <Script src="./SCORM_API_wrapper.js" strategy="beforeInteractive" />
      <ThreeScene />
    </div>
  );
}
