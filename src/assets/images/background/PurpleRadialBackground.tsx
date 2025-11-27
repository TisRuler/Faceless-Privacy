export const PurpleRadialBackground = () => {
  return (
    <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: 0
    }}
  >
    <svg
        className="w-full h-full"
        viewBox="0 0 1047 589"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <rect width="1047" height="589" fill="url(#purple-middle)" />
        <rect width="1047" height="589" fill="url(#black-bottom)" />
        <defs>
        <radialGradient
            id="purple-middle"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(524 0) rotate(90) scale(642 1124.03)"
          >
            <stop offset="0.42623" stopColor="#5B0DC3" stopOpacity="0" />
            <stop offset="1" stopColor="#0" />
          </radialGradient>
          <radialGradient
            id="black-bottom"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(524 0) rotate(90) scale(642 1124.03)"
          >
            <stop offset="0.42623" stopOpacity="0" />
            <stop offset="1" stopColor="#000000" />
          </radialGradient>
          
        </defs>
      </svg>
    </div>
  );
};

