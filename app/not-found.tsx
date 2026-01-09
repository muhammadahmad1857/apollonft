"use client"
import { motion } from 'framer-motion';
import { Bug as BugIcon } from 'lucide-react';
import  Link  from 'next/link';
  // Bug component with random starting positions and crawling movement
  const Bug = ({ top, left, delay }:{
    top: number;
    left: number;
    delay:number;
  }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 1,
        x: [0, 15, -10, 5, 0],
        y: [0, -10, 15, -5, 0],
        rotate: [0, 15, -15, 10, 0]
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut"
      }}
      style={{ top: `${top}%`, left: `${left}%` }}
      className="absolute text-green-400/80 z-0"
    >
      <BugIcon size={24} />
    </motion.div>
  );
const NotFound = () => {


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Decorative Bugs scattered across the background */}
      <Bug top={15} left={10} delay={0} />
      <Bug top={25} left={85} delay={1} />
      <Bug top={75} left={15} delay={2} />
      <Bug top={80} left={70} delay={0.5} />
      <Bug top={10} left={60} delay={1.5} />

      {/* Main Content Card */}
      <div className=" w-full max-w-4xl rounded-[50px] p-12 md:p-20 flex flex-col items-center text-center relative z-10 shadow-2xl">
        
        {/* Header Logo */}
        <div className="flex items-center gap-2 mb-16">
          <div className="bg-[#eab308] rounded-full w-8 h-8 flex items-center justify-center text-black font-bold text-xs">AN</div>
          <span className="dark:text-white text-black font-semibold tracking-wide">ApolloNFT</span>
        </div>

        {/* 404 Display with Jump Zone */}
        <div className="flex items-center justify-center gap-6 mb-10">
          <h1 className="dark:text-white text-black text-[120px] md:text-[180px] font-bold leading-none select-none">4</h1>
          
          {/* Jumping Emoji Zone */}
          <div className="flex flex-col items-center justify-between h-30 md:h-45 py-4">
            {/* Top Bar */}
            <div className="w-12 md:w-16 h-1.5 bg-black dark:bg-white rounded-full opacity-80" />
            
            <motion.div 
              animate={{ 
                y: [0, -50, 0],
                scaleX: [1, 0.9, 1.1, 1], // Squish effect on landing
                scaleY: [1, 1.1, 0.8, 1]
              }}
              transition={{ 
                duration: 0.8, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="w-16 h-16 md:w-20 md:h-20 bg-[#eab308] rounded-full flex items-center justify-center text-4xl border-4 border-black shadow-inner"
            >
              😵‍💫
            </motion.div>

            {/* Bottom Bar */}
            <div className="w-12 md:w-16 h-1.5 bg-black dark:bg-white  rounded-full opacity-80" />
          </div>

          <h1 className="dark:text-white text-black text-[120px] md:text-[180px] font-bold leading-none select-none">4</h1>
        </div>

        {/* Text Section */}
        <p className="text-gray-400 max-w-md text-sm md:text-base mb-12 leading-relaxed">
          The  You&apos;re Looking for Can&apos;t be Found, It&apos;s Looks Like You&apos;re Trying to Access a Page That Either Has Been Deleted or Never Existed...
        </p>

        {/* Home Button */}
        <Link href="/" className="bg-[#eab308] hover:bg-yellow-300 transition-all hover:scale-105 active:scale-95 text-black font-bold py-4 cursor-pointer px-12 rounded-2xl uppercase text-sm tracking-widest shadow-lg">
          Home Page
        </Link>

        {/* Footer */}
        <div className="w-full mt-24 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5 pt-8">
          <p className="text-gray-500 text-xs tracking-tight">© 2026 ApolloNFT. All rights reserved</p>
          {/* <div className="flex gap-6">
            <Instagram className="w-5 h-5 text-[#eab308] cursor-pointer hover:text-white transition-colors" />
            <Youtube className="w-5 h-5 text-[#eab308] cursor-pointer hover:text-white transition-colors" />
            <Github className="w-5 h-5 text-[#eab308] cursor-pointer hover:text-white transition-colors" />
            <Linkedin className="w-5 h-5 text-[#eab308] cursor-pointer hover:text-white transition-colors" />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default NotFound;