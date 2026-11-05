import Image from "next/image";
import Link from "next/link";
import SignedInNavItems from "./SignedInNavItems";
import Avatar from "./Avatar";


const Navbar = () => (
  <header>
    <nav>
      <Link href="/" className="logo">
        <Image
          src="/icons/logo.png"
          alt="logo"
          width={24} height={24}
        />

        <p>DevEv</p>
      </Link>

      <ul>
        <Link href="/" className="max-[390px]:hidden">Home</Link>
        <Link href="/events">Events</Link>
        <SignedInNavItems />
        <Avatar />
      </ul>
    </nav>
  </header>
)


export default Navbar;