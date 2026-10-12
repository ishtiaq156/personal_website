import { motion } from "framer-motion";

type DarkModeIconProps = {
  mode: "sun" | "moon";
  reducedMotion: boolean;
};

const draw = {
  hidden: { pathLength: 0 },
  visible: { pathLength: 1 },
};

export default function DarkModeIcon({
  mode,
  reducedMotion,
}: DarkModeIconProps) {
  const isMoon = mode === "moon";
  const stroke = isMoon ? "#334155" : "#ffffff";
  const transition = {
    duration: reducedMotion ? 0 : 1,
    ease: "easeInOut" as const,
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      width="48"
      height="48"
      fillRule="evenodd"
      clipRule="evenodd"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke={stroke} strokeWidth="30">
        <motion.path
          d="M510.421 869.947c0 254.123-2.048 47.928.222 96.265M857.002 166.323c-179.694 179.694-35.339 32.442-67.913 68.226M511.974 24.622c0 254.125-2.047 47.928.222 96.264M257.046 767.38c-179.693 179.693-35.338 32.442-67.912 68.226M998.612 512.779c-254.125 0-47.928-2.047-96.264.222M155.654 513.331c-254.125 0-47.928-2.048-96.264.222M856.126 860.191c-179.693-179.693-32.442-35.338-68.226-67.912M256.048 258.243c-179.694-179.694-32.443-35.338-68.226-67.913"
          strokeLinecap="round"
          initial={reducedMotion ? false : { opacity: isMoon ? 1 : 0 }}
          animate={{ opacity: isMoon ? 0 : 1 }}
          transition={transition}
        />
        <motion.path
          d="M739.766 624.135c-26.713 9.599-55.508 14.829-85.525 14.829h0c-139.654 0-252.865-113.212-252.865-252.865h0c0-38.841 8.757-75.636 24.404-108.52"
          strokeLinecap="round"
          variants={draw}
          initial={reducedMotion ? false : isMoon ? "hidden" : "visible"}
          animate={isMoon ? "visible" : "hidden"}
          transition={transition}
        />
        <motion.path
          d="M426.449 277.842c26.712-9.599 55.508-14.829 85.525-14.829h0c139.654 0 252.865 113.211 252.865 252.865h0c0 38.841-8.757 75.636-24.405 108.52"
          variants={draw}
          initial={reducedMotion ? false : isMoon ? "visible" : "hidden"}
          animate={isMoon ? "hidden" : "visible"}
          transition={transition}
        />
        <path
          d="M740.434 624.398c-40.614 85.35-127.647 144.345-228.46 144.345h0c-139.653 0-252.865-113.212-252.865-252.865h0c0-109.636 69.774-202.976 167.34-238.036"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
