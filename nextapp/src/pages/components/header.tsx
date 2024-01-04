import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isOpen, setOpen] = useState<boolean>(false);
  const handleMenuOpen = () => {
    setOpen(!isOpen);
  };

  const handleMenuClose = () => {
    setOpen(false);
  };

  return (
    <header className="py-6 px-4 flex justify-between items-center">

      <nav
        className={
          isOpen
            ? "z-40 bg-blue-100 fixed top-0 right-0 bottom-0 left-0 h-screen flex flex-col"
            : "fixed right-[-100%] md:right-4"
        }
      >
        <ul
          className={
            isOpen
              ? "flex h-screen justify-center items-center flex-col gap-6 text-xl"
              : "block md:flex md:gap-8"
          }
        >
          <li>
            <Link onClick={handleMenuClose} href="/">
              TOP
            </Link>
          </li>
          <li>
            <Link onClick={handleMenuClose} href="/mypage">
              MYPAGE
            </Link>
          </li>
          <li>
            <Link onClick={handleMenuClose} href="/Login">
              Login
            </Link>
          </li>
        </ul>
      </nav>
      <button className="z-50 space-y-2 md:hidden" onClick={handleMenuOpen}>
        <span
          className={
            isOpen
              ? "block w-8 h-0.5 bg-gray-600 translate-y-2.5 rotate-45 duration-300"
              : "block w-8 h-0.5 bg-gray-600 duration-300"
          }
        />
        <span
          className={
            isOpen ? "block opacity-0 duration-300" : "block w-8 h-0.5 bg-gray-600 duration-300"
          }
        />
        <span
          className={
            isOpen
              ? "block w-8 h-0.5 bg-gray-600 -rotate-45 duration-300"
              : "block w-8 h-0.5 bg-gray-600 duration-300"
          }
        />
      </button>
    </header>
  );
}

// // import { useState } from "react";
// import React, { useState } from "react";
// import Link from "next/link";

// export default function Header() {
//   const [menuOpen, setMenuOpen] = useState(false);

//   const handleToggleMenu = () => {
//     setMenuOpen(!menuOpen);
//   };

//   return (
//     <div className="bg-white">
//       <button onClick={handleToggleMenu}>☆</button>
//       {menuOpen && (
//         <div>
//           <Link href="/Home">ホーム</Link>
//           <Link href="/mypage">マイページ</Link>
//           <p>相談</p>
//           <p>ログイン</p>
//         </div>
//       )}
//     </div>
//   );
// }


