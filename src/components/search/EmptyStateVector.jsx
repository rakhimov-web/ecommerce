const EmptyStateVector = ({ width = 160, height = 140 }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 160 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", margin: "0 auto" }}
      aria-hidden="true"
    >
      {/* Yuqoriga tarqaluvchi nur chiziqlari (Search rays) */}
      <line
        x1="45"
        y1="12"
        x2="52"
        y2="28"
        stroke="#94a3b8"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="68"
        y1="10"
        x2="72"
        y2="28"
        stroke="#94a3b8"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="102"
        y1="10"
        x2="97"
        y2="28"
        stroke="#94a3b8"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="122"
        y1="12"
        x2="114"
        y2="28"
        stroke="#94a3b8"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Orqa papka asosi (Folder Back) */}
      <path
        d="M28 42C28 37.5817 31.5817 34 36 34H62C65.5 34 68.5 36.5 70 39.5L74 46H114C118.418 46 122 49.5817 122 54V102C122 106.418 118.418 110 114 110H36C31.5817 110 28 106.418 28 102V42Z"
        fill="#cbd5e1"
      />

      {/* Papka ichidagi qog'oz varag'i (Document Sheet inside) */}
      <rect
        x="38"
        y="42"
        width="74"
        height="56"
        rx="6"
        fill="#f1f5f9"
      />

      {/* Oldingi ochiq qopqoq (Folder Front Flap) */}
      <path
        d="M26 62C26 57.5817 29.5817 54 34 54H116C120.418 54 124 57.5817 124 62V104C124 108.418 120.418 112 116 112H34C29.5817 112 26 108.418 26 104V62Z"
        fill="#e2e8f0"
      />

      {/* Papka old qopqoq burchagi / qirrasi */}
      <path
        d="M26 68L36 54H124V104C124 108.418 120.418 112 116 112H34C29.5817 112 26 108.418 26 104V68Z"
        fill="#e8edf4"
      />

      {/* Katta zamonaviy kattalashtiruvchi oyna (Magnifying Glass) */}
      <circle
        cx="108"
        cy="92"
        r="20"
        stroke="#94a3b8"
        strokeWidth="6"
        fill="#ffffff"
        fillOpacity="0.85"
      />
      {/* Oyna yaltirashi (Glass shine) */}
      <path
        d="M98 84C100.5 81.5 104 80 108 80"
        stroke="#cbd5e1"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Lupa tutqichi (Magnifier Handle) */}
      <line
        x1="123"
        y1="107"
        x2="138"
        y2="122"
        stroke="#94a3b8"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default EmptyStateVector;
