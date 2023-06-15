import Link from "next/link";
import {
  Planet,
} from "tabler-icons-react";
import Navbar from "./Navbar";
import Button from "./Button";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();

  return (
    <>
      <Navbar blurBackground classes="justify-between pl-8">
        <Link href={`../../../#`} className="flex items-end gap-2">
         <Planet size={36} />
        </Link>
        <div className="flex flex-row items-center">
          <Navbar.Section classes="px-4">
            <Navbar.Link href="../../#pricing/">Pricing</Navbar.Link>
          </Navbar.Section>
          <Navbar.Section classes="px-4 ">
            <Button
              onClick={() => void router.push("../../auth/login")}
              variant="info"
              classes="rounded-full"
            >
              <span>Get started</span>
            </Button>
          </Navbar.Section>
        </div>
      </Navbar>
    </>
  );
}
