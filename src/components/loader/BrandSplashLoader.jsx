import { useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./brandSplashLoader.module.css";

// 1. Asosiy moviy savatcha belgisi (xalqaro universal shopping mark)
const BLUE_BAG_PATH =
  "M220.37 95.5531C222.18 95.5531 223.22 91.8431 199.19 171.553C195.8 182.833 191.96 193.893 190.67 196.133C187.5 201.663 181.13 207.233 174.34 210.413C168.72 213.053 168.72 213.053 110.72 213.053C46.1197 213.053 49.1597 213.353 39.2097 206.043C30.7897 199.863 29.5997 197.003 13.7697 145.053C-2.26029 92.4031 -2.0603 93.5431 3.1797 85.2731C7.0697 79.1331 14.3397 75.5531 22.8997 75.5531C28.6197 75.5531 29.2197 75.3531 29.6197 73.3031C31.8497 61.6931 32.7597 58.1931 34.9797 52.5531C46.2797 23.9131 72.0397 4.04313 102.49 0.493126C131.5 -2.89687 161.53 11.4231 177.63 36.3131C182.76 44.2331 183.17 46.3832 180.12 49.1432C177.24 51.7432 175.42 55.5131 174.14 61.5031C173.05 66.5531 173.05 66.5531 168.39 66.5531C163.72 66.5431 163.72 66.5431 160.07 58.8031C153.55 44.9431 141 34.0431 126.36 29.5131C118.6 27.1131 105.14 26.9031 96.9197 29.0431C78.8197 33.7531 62.8697 49.0231 57.7997 66.4831C54.8597 76.6031 48.1197 75.5531 115.75 75.5531C171.57 75.5531 175.32 75.6631 175.83 77.3031C179.01 87.4731 183.86 93.1231 193 97.3031C197.49 99.3631 199.52 99.7031 205.54 99.3831C209.63 99.1631 214.19 98.2531 216.12 97.2731C218 96.3331 219.91 95.5531 220.37 95.5531ZM167.22 139.303C167.22 133.863 162.93 129.543 157.55 129.573C153.16 129.603 150.81 131.283 146.8 137.283C138.89 149.123 123.29 156.273 107.52 155.293C93.3997 154.413 82.5497 147.943 71.4097 133.763C68.4097 129.933 67.6997 129.553 63.6197 129.553C57.3497 129.553 54.2197 132.723 54.2197 139.073C54.2197 144.543 57.3797 149.693 65.7497 157.863C77.5597 169.403 93.0497 175.713 109.72 175.793C127.41 175.873 141.64 170.493 154 159.053C163.08 150.643 167.22 144.463 167.22 139.303Z";

// 2. Zarg'aldoq aksent nuqtasi
const ORANGE_DOT_PATH =
  "M223.38 59.9831C226.21 66.0431 225.56 75.9331 221.97 81.3631C218.04 87.2831 211.38 90.8831 204.35 90.8831C197.92 90.8731 194.11 89.2032 189.58 84.3932C182.65 77.0132 181.38 69.0431 185.68 59.8131C188.43 53.9031 194.67 49.1631 201.12 48.0731C209.63 46.6331 219.65 51.9931 223.38 59.9831Z";

// 3. STORE neytral xalqaro brend harflari (S - T - O - R - E)
const STORE_LETTERS = [
  { char: "S", x: 264 },
  { char: "T", x: 346 },
  { char: "O", x: 424 },
  { char: "R", x: 518 },
  { char: "E", x: 604 },
];

const BrandSplashLoader = ({ onComplete }) => {
  useEffect(() => {
    // 1.5s: Logotip chizilishi, harflar silliq chiqishi va sheen o'tishi yakunlanadi
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className={styles.splashOverlay}
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
      }}
    >
      <motion.div
        className={styles.loaderContent}
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{
          opacity: 0,
          scale: 1.008,
          filter: "blur(2.5px)",
          transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
        }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Neytral e-commerce logotipi (Shopping Bag + STORE) */}
        <div className={styles.svgWrapper}>
          <svg
            className={styles.logoSvg}
            viewBox="0 0 700 214"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="loader_orange_grad"
                x1="180"
                y1="48"
                x2="225"
                y2="90"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="var(--accent)" />
                <stop offset="100%" stopColor="var(--accent-dark)" />
              </linearGradient>
            </defs>

            {/* 1. Moviy rangli savat belgisi (Stroke-draw va to'lish) */}
            <motion.path
              d={BLUE_BAG_PATH}
              stroke="var(--primary)"
              strokeWidth={3.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="var(--primary)"
              fillRule="evenodd"
              clipRule="evenodd"
              initial={{
                pathLength: 0,
                opacity: 0,
                strokeOpacity: 1,
                fillOpacity: 0,
              }}
              animate={{
                pathLength: 1,
                opacity: 1,
                strokeOpacity: 0,
                fillOpacity: 1,
              }}
              transition={{
                opacity: { duration: 0.04, delay: 0.06 },
                pathLength: {
                  duration: 0.68,
                  ease: [0.65, 0, 0.35, 1],
                  delay: 0.06,
                },
                fillOpacity: {
                  duration: 0.3,
                  ease: [0.25, 0.1, 0.25, 1],
                  delay: 0.54,
                },
                strokeOpacity: {
                  duration: 0.2,
                  ease: "easeOut",
                  delay: 0.72,
                },
              }}
            />

            {/* 2. Zarg'aldoq aksent nuqta */}
            <motion.path
              d={ORANGE_DOT_PATH}
              stroke="var(--accent)"
              strokeWidth={3.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="url(#loader_orange_grad)"
              fillRule="evenodd"
              clipRule="evenodd"
              initial={{
                pathLength: 0,
                opacity: 0,
                strokeOpacity: 1,
                fillOpacity: 0,
              }}
              animate={{
                pathLength: 1,
                opacity: 1,
                strokeOpacity: 0,
                fillOpacity: 1,
              }}
              transition={{
                opacity: { duration: 0.04, delay: 0.22 },
                pathLength: {
                  duration: 0.45,
                  ease: [0.65, 0, 0.35, 1],
                  delay: 0.22,
                },
                fillOpacity: {
                  duration: 0.26,
                  ease: [0.25, 0.1, 0.25, 1],
                  delay: 0.5,
                },
                strokeOpacity: {
                  duration: 0.18,
                  ease: "easeOut",
                  delay: 0.68,
                },
              }}
            />

            {/* 3. STORE neytral brend tipografiyasi harflari */}
            {STORE_LETTERS.map(({ char, x }, index) => {
              const letterDelay = 0.2 + index * 0.07;
              return (
                <motion.text
                  key={char}
                  x={x}
                  y="146"
                  fontFamily="var(--font-primary)"
                  fontSize="102"
                  fontWeight="800"
                  fill="var(--black)"
                  initial={{ opacity: 0, y: 156 }}
                  animate={{ opacity: 1, y: 146 }}
                  transition={{
                    duration: 0.42,
                    delay: letterDelay,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {char}
                </motion.text>
              );
            })}
          </svg>

          {/* Logotip ustidan o'tuvchi nafis specular sheen */}
          <motion.div
            className={styles.shimmerBeam}
            initial={{ x: "-120px", opacity: 0 }}
            animate={{ x: ["-120px", "320px"], opacity: [0, 0.55, 0] }}
            transition={{
              duration: 0.65,
              ease: [0.25, 0.1, 0.25, 1],
              delay: 0.95,
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BrandSplashLoader;
