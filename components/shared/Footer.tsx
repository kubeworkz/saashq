import { useState } from "react";
import { Input } from "./Input";

export function Footer() {
  const [email, setEmail] = useState("");
  return (
    <div className="m-auto max-w-7xl py-12 px-4 lg:px-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-start lg:flex-row lg:justify-between">
          <a href="../../../" className="text-4xl font-semibold text-slate-800">
            <img className="h-10" src="../../branding/icon-b.png" />
          </a>
          <div className="flex flex-col gap-2">
            <a className="text-sm font-medium text-slate-600">
              Terms of Service
            </a>
            <a className="text-sm font-medium text-slate-600">Privacy Policy</a>
          </div>
        </div>
        <div className="flex flex-col items-center border-y border-slate-200 py-6 lg:flex-row lg:justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-slate-800">Get in touch</p>
            <p className="text-sm font-normal text-slate-600">
              Reach us at our social medias or email at email@example.com
            </p>
          </div>
          <div className="flex flex-row items-stretch gap-2">
            <Input placeholder="Email" onChange={setEmail} value={email} />
            <button className="inline-flex items-center gap-2 rounded-md border border-secondary bg-secondary px-2  text-sm font-medium text-white hover:opacity-80 ">
              <span>Subscribe</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
