export const motionClass = {
  standard: "transition-all duration-[160ms] ease-[cubic-bezier(0.2,0,0,1)]",
  colorFast: "transition-colors duration-[160ms] ease-[cubic-bezier(0.2,0,0,1)]",
  colorBase: "transition-colors duration-[160ms] ease-[cubic-bezier(0.2,0,0,1)]",
  chevron: "transition-transform duration-[160ms] ease-[cubic-bezier(0.2,0,0,1)]",
  sectionEnter: "transition-[opacity,transform] duration-[220ms] ease-[cubic-bezier(0.2,0,0,1)]",
  bannerLifecycle:
    "transition-[opacity,transform,max-height,margin] duration-[160ms] ease-[cubic-bezier(0.2,0,0,1)]",
  softFadeTransform:
    "transition-[opacity,transform] duration-[160ms] ease-[cubic-bezier(0.2,0,0,1)]",
  softFadeFast:
    "transition-[opacity,transform] duration-[160ms] ease-[cubic-bezier(0.2,0,0,1)]",
} as const;
