"use client"

import {
  motion,
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
} from "framer-motion";
import React, { useRef } from "react";

export const VelocityText = () => {
  const targetRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const scrollVelocity = useVelocity(scrollYProgress);

  const skewXRaw = useTransform(
    scrollVelocity,
    [-0.5, 0.5],
    ["45deg", "-45deg"]
  );
  const skewX = useSpring(skewXRaw, { mass: 3, stiffness: 400, damping: 50 });

  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -4000]);
  const x = useSpring(xRaw, { mass: 3, stiffness: 400, damping: 50 });

  return (
    <section
      ref={targetRef}
      className="h-[500vh] bg-neutral-50 dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50"
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.p
          style={{ skewX, x }}
          className="origin-bottom-left whitespace-nowrap text-xl md:text-2xl lg:text-3xl font-bold uppercase leading-tight"
        >
          Nothing in this world can take the place of persistence. Talent will
          not; nothing is more common than unsuccessful men with talent. Genius
          will not; unrewarded genius is almost a proverb. Education will not;
          the world is full of educated derelicts. Persistence and determination
          alone are omnipotent. The slogan 'Press On!' has solved and always
          will solve the problems of the human race. {' '}
          {/* Repeat text for continuous scrolling */}
          Nothing in this world can take the place of persistence. Talent will
          not; nothing is more common than unsuccessful men with talent. Genius
          will not; unrewarded genius is almost a proverb. Education will not;
          the world is full of educated derelicts. Persistence and determination
          alone are omnipotent. The slogan 'Press On!' has solved and always
          will solve the problems of the human race.
        </motion.p>
      </div>
    </section>
  );
};

