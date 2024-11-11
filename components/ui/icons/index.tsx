'use client';

import {
  motion,
  useAnimation,
  Variants,
  Transition,
  AnimatePresence,

} from 'framer-motion';
import { useEffect, useState } from 'react';


const usersPathVariants: Variants = {
  normal: {
    translateX: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 13,
    },
  },
  animate: {
    translateX: [-6, 0],
    transition: {
      delay: 0.1,
      type: 'spring',
      stiffness: 200,
      damping: 13,
    },
  },
};

const UsersIcon = () => {
  const controls = useAnimation();

  return (
    <div
      className="cursor-pointer select-none hover:bg-accent rounded-md transition-colors duration-200 flex items-center justify-center"
      onMouseEnter={() => controls.start('animate')}
      onMouseLeave={() => controls.start('normal')}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <motion.path
          d="M22 21v-2a4 4 0 0 0-3-3.87"
          variants={usersPathVariants}
          animate={controls}
        />
        <motion.path
          d="M16 3.13a4 4 0 0 1 0 7.75"
          variants={usersPathVariants}
          animate={controls}
        />
      </svg>
    </div>
  );
};

export { UsersIcon };


const chartPiepathVariants: Variants = {
  normal: { translateX: 0, translateY: 0 },
  animate: { translateX: 1.1, translateY: -1.1 },
};

const ChartPieIcon = () => {
  const controls = useAnimation();

  return (
    <div
      className='cursor-pointer select-none hover:bg-accent rounded-md transition-colors duration-200 flex items-center justify-center'
      onMouseEnter={() => controls.start('animate')}
      onMouseLeave={() => controls.start('normal')}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='28'
        height='28'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <motion.path
          d='M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z'
          transition={{
            type: 'spring',
            stiffness: 250,
            damping: 15,
            bounce: 0.6,
          }}
          variants={chartPiepathVariants}
          animate={controls}
        />
        <path d='M21.21 15.89A10 10 0 1 1 8 2.83' />
      </svg>
    </div>
  );
};

export { ChartPieIcon };

const circleVariants: Variants = {
  normal: {
    opacity: 1,
    pathLength: 1,
    pathOffset: 0,
    transition: {
      duration: 0.4,
      opacity: { duration: 0.1 },
    },
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    pathOffset: [1, 0],
    transition: {
      duration: 0.3,
      opacity: { duration: 0.1 },
    },
  },
};

const atSignpathVariants: Variants = {
  normal: {
    opacity: 1,
    pathLength: 1,
    transition: {
      delay: 0.3,
      duration: 0.3,
      opacity: { duration: 0.1, delay: 0.3 },
    },
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    transition: {
      delay: 0.3,
      duration: 0.3,
      opacity: { duration: 0.1, delay: 0.3 },
    },
  },
};

const AtSignIcon = () => {
  const controls = useAnimation();

  return (
    <div
      className='cursor-pointer select-none  hover:bg-accent rounded-md transition-colors duration-200 flex items-center justify-center'
      onMouseEnter={() => controls.start('animate')}
      onMouseLeave={() => controls.start('normal')}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='28'
        height='28'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <motion.circle
          variants={circleVariants}
          animate={controls}
          cx='12'
          cy='12'
          r='4'
        />
        <motion.path
          variants={atSignpathVariants}
          animate={controls}
          d='M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8'
        />
      </svg>
    </div>
  );
};

export { AtSignIcon };

const circles = [
  { cx: 19, cy: 5 }, // Top right
  { cx: 12, cy: 5 }, // Top middle
  { cx: 19, cy: 12 }, // Middle right
  { cx: 5, cy: 5 }, // Top left
  { cx: 12, cy: 12 }, // Center
  { cx: 19, cy: 19 }, // Bottom right
  { cx: 5, cy: 12 }, // Middle left
  { cx: 12, cy: 19 }, // Bottom middle
  { cx: 5, cy: 19 }, // Bottom left
];

const GripIcon = () => {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    const animateCircles = async () => {
      if (isHovered) {
        await controls.start((i) => ({
          opacity: 0.3,
          transition: {
            delay: i * 0.1,
            duration: 0.2,
          },
        }));
        await controls.start((i) => ({
          opacity: 1,
          transition: {
            delay: i * 0.1,
            duration: 0.2,
          },
        }));
      }
    };

    animateCircles();
  }, [isHovered, controls]);

  return (
    <div
      className='cursor-pointer select-none  hover:bg-accent rounded-md transition-colors duration-200 flex items-center justify-center'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='28'
        height='28'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <AnimatePresence>
          {circles.map((circle, index) => (
            <motion.circle
              key={`${circle.cx}-${circle.cy}`}
              cx={circle.cx}
              cy={circle.cy}
              r='1'
              initial='initial'
              variants={{
                initial: {
                  opacity: 1,
                },
              }}
              animate={controls}
              exit='initial'
              custom={index}
            />
          ))}
        </AnimatePresence>
      </svg>
    </div>
  );
};

export { GripIcon };

const SettingsGearIcon = () => {
  const controls = useAnimation();

  return (
    <div
      className='mr-2 h-4 w-4 cursor-pointer select-none hover:bg-accent rounded-md transition-colors duration-200 flex items-center justify-center'
      onMouseEnter={() => controls.start('animate')}
      onMouseLeave={() => controls.start('normal')}
    >
      <motion.svg
        xmlns='http://www.w3.org/2000/svg'
        width='28'
        height='28'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        transition={{ type: 'spring', stiffness: 50, damping: 10 }}
        variants={{
          normal: {
            rotate: 0,
          },
          animate: {
            rotate: 180,
          },
        }}
        animate={controls}
      >
        <path d='M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z' />
        <circle cx='12' cy='12' r='3' />
      </motion.svg>
    </div>
  );
};

export { SettingsGearIcon };

const pathVariants: Variants = {
  animate: {
    x: 2,
    translateX: [0, -3, 0],
    transition: {
      duration: 0.4,
    },
  },
};

const LogoutIcon = () => {
  const controls = useAnimation();

  return (
    <div
      className='mr-2 h-4 w-4 cursor-pointer select-none hover:bg-accent rounded-md transition-colors duration-200 flex items-center justify-center'
      onMouseEnter={() => controls.start('animate')}
      onMouseLeave={() => controls.start('normal')}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='28'
        height='28'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' />
        <motion.polyline
          points='16 17 21 12 16 7'
          variants={pathVariants}
          animate={controls}
        />
        <motion.line
          x1='21'
          x2='9'
          y1='12'
          y2='12'
          variants={pathVariants}
          animate={controls}
        />
      </svg>
    </div>
  );
};

export { LogoutIcon };

const defaultTransition: Transition = {
  duration: 0.6,
  opacity: { duration: 0.2 },
};

const pathVariant: Variants = {
  normal: {
    pathLength: 1,
    opacity: 1,
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
  },
};

const HomeIcon = () => {
  const controls = useAnimation();

  return (
    <div
      className=' cursor-pointer select-none hover:bg-accent rounded-md transition-colors duration-200 flex items-center justify-center'
      onMouseEnter={() => controls.start('animate')}
      onMouseLeave={() => controls.start('normal')}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='25'
        height='25'
        strokeWidth='1.5'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' />
        <motion.path
          d='M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8'
          variants={pathVariant}
          transition={defaultTransition}
          animate={controls}
        />
      </svg>
    </div>
  );
};

export { HomeIcon };

const userPathVariant: Variants = {
  normal: { pathLength: 1, opacity: 1, pathOffset: 0 },
  animate: {
    pathLength: [0, 1],
    opacity: [0, 1],
    pathOffset: [1, 0],
  },
};

const circleVariant: Variants = {
  normal: {
    pathLength: 1,
    pathOffset: 0,
    scale: 1,
  },
  animate: {
    pathLength: [0, 1],
    pathOffset: [1, 0],
    scale: [0.5, 1],
  },
};

const UserIcon = () => {
  const controls = useAnimation();

  return (
    <div
      className='cursor-pointer select-none hover:bg-accent rounded-md transition-colors duration-200 flex items-center justify-center'
      onMouseEnter={() => controls.start('animate')}
      onMouseLeave={() => controls.start('normal')}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='10'
        height='10'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <motion.circle
          cx='12'
          cy='8'
          r='5'
          animate={controls}
          variants={circleVariant}
        />

        <motion.path
          d='M20 21a8 8 0 0 0-16 0'
          variants={userPathVariant}
          transition={{
            delay: 0.2,
            duration: 0.4,
          }}
          animate={controls}
        />
      </svg>
    </div>
  );
};

export { UserIcon };

const fingerprintPathVariants: Variants = {
  normal: {
    pathLength: 1,
    opacity: 1,
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    transition: {
      duration: 0.8,
      ease: 'easeInOut',
    },
  },
};

const FingerprintIcon = () => {
  const controls = useAnimation();

  return (
    <div
      className='cursor-pointer select-none hover:bg-accent rounded-md transition-colors duration-200 flex items-center justify-center'
      onMouseEnter={() => controls.start('animate')}
      onMouseLeave={() => controls.start('normal')}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='25'
        height='25'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <motion.path
          d='M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4'
          variants={fingerprintPathVariants}
          animate={controls}
        />
        <motion.path
          d='M14 13.12c0 2.38 0 6.38-1 8.88'
          variants={fingerprintPathVariants}
          animate={controls}
        />
        <motion.path
          d='M17.29 21.02c.12-.6.43-2.3.5-3.02'
          variants={fingerprintPathVariants}
          animate={controls}
        />
        <motion.path
          d='M2 12a10 10 0 0 1 18-6'
          variants={fingerprintPathVariants}
          animate={controls}
        />
        <motion.path
          d='M2 16h.01'
          variants={fingerprintPathVariants}
          animate={controls}
        />
        <motion.path
          d='M21.8 16c.2-2 .131-5.354 0-6'
          variants={fingerprintPathVariants}
          animate={controls}
        />
        <motion.path
          d='M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2'
          variants={fingerprintPathVariants}
          animate={controls}
        />
        <motion.path
          d='M8.65 22c.21-.66.45-1.32.57-2'
          variants={fingerprintPathVariants}
          animate={controls}
        />
        <motion.path
          d='M9 6.8a6 6 0 0 1 9 5.2v2'
          variants={fingerprintPathVariants}
          animate={controls}
        />
      </svg>
    </div>
  );
};

export { FingerprintIcon };

const penVariants: Variants = {
  normal: {
    rotate: 0,
    x: 0,
    y: 0,
  },
  animate: {
    rotate: [-0.5, 0.5, -0.5],
    x: [0, -1, 1.5, 0],
    y: [0, 1.5, -1, 0],
  },
};

const SquarePenIcon = () => {
  const controls = useAnimation();

  return (
    <div
      className='cursor-pointer select-none hover:bg-accent rounded-md transition-colors duration-200 flex items-center justify-center'
      onMouseEnter={() => controls.start('animate')}
      onMouseLeave={() => controls.start('normal')}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        strokeWidth='1.5'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
        <motion.path
          d='M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z'
          variants={penVariants}
          animate={controls}
          transition={{
            duration: 0.5,
            repeat: 1,
            ease: 'easeInOut',
          }}
        />
      </svg>
    </div>
  );
};

export { SquarePenIcon };
