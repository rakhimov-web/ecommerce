const ShoppingBagPlusIcon = ({
  size = 18,
  strokeWidth = 2,
  className = "",
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    {/* Tutqich (Handle) */}
    <path d="M8.5 7V5.5a3.5 3.5 0 0 1 7 0V7" />
    {/* Yuqori gardish va o'ng qirra (Top rim & right edge down to plus) */}
    <path d="M4 7h16l-.8 6.5" />
    {/* Chap qirra va pastki asos (Left edge & bottom base) */}
    <path d="M4 7l1.5 12.2a2 2 0 0 0 2 1.8h5.5" />
    {/* Plus belgisi (Plus sign at bottom right) */}
    <path d="M18.5 15.5v6" />
    <path d="M15.5 18.5h6" />
  </svg>
);

export default ShoppingBagPlusIcon;
