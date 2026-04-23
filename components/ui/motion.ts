export const motionClass = {
  standard: "transition-all duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)]",
  colorFast: "transition-colors duration-[120ms] ease-[cubic-bezier(0.2,0,0,1)]",
  colorBase: "transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)]",
  chevron: "transition-transform duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)]",
  bannerLifecycle:
    "transition-[opacity,transform,max-height,margin] duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)]",
  softFadeTransform:
    "transition-[opacity,transform] duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)]",
  softFadeFast:
    "transition-[opacity,transform] duration-[120ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
} as const;
