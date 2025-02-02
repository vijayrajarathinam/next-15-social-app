import Link from "next/link";
import UserButton from "./UserButton";
import SearchField from "./SearchField";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-5 px-5 py-3">
        <Link href="/" className="text-lg font-bold text-primary sm:text-2xl">
          BugBook
        </Link>
        <SearchField />
        <UserButton className="sm:ms-auto" />
      </div>
    </header>
  );
}
