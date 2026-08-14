export const fadeUp = {
  hidden: {
    opacity: 0,
    y: 40,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export const fadeDown = {
  hidden: {
    opacity: 0,
    y: -40,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export const fadeLeft = {
  hidden: {
    opacity: 0,
    x: -40,
  },

  visible: {
    opacity: 1,
    x: 0,

    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export const fadeRight = {
  hidden: {
    opacity: 0,
    x: 40,
  },

  visible: {
    opacity: 1,
    x: 0,

    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export const scaleIn = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },

  visible: {
    opacity: 1,
    scale: 1,

    transition: {
      duration: 0.45,
    },
  },
};

export const staggerContainer = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const hoverLift = {
  whileHover: {
    y: -6,
    scale: 1.02,
    transition: {
      duration: 0.25,
    },
  },
};

export const tap = {
  whileTap: {
    scale: 0.98,
  },
};