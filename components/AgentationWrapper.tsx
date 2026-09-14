"use client";

import { useState, useEffect } from "react";
import { Agentation } from "agentation";

export default function AgentationWrapper() {
  const [isLocalhost, setIsLocalhost] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      if (host === "localhost" || host === "127.0.0.1" || host.endsWith(".local")) {
        setIsLocalhost(true);
      }
    }
  }, []);

  if (!isLocalhost) {
    return null;
  }

  return <Agentation />;
}
