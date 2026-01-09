import { useTheme } from "next-themes";
import Image from "next/image";

const Logo = () => {
   const {resolvedTheme}=  useTheme()
  return (
    <Image className='size-full object-contain' width={200} height={200} src={resolvedTheme === "dark" ? '/Apollo nft-01-white.png' : '/Apollo nft-01-black.png'} alt="Logo"/>
  )
}
export default Logo;