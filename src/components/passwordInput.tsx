"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";

interface PasswordInputProps {
  field?: React.InputHTMLAttributes<HTMLInputElement>;
}

export default function PasswordInput(props: PasswordInputProps) {
  const [isShown, setIsShown] = useState(false);

  return (
    <div className="relative">
      <Input
        id="senha"
        type={isShown ? "text" : "password"}
        placeholder="••••••"
        className="w-full border border-border rounded h-12 px-4 py-3"
        {...props.field}
      />
      <button
        type="button"
        onClick={() => setIsShown(!isShown)}
        className="absolute right-3 top-1/2 -translate-y-1/2"
      >
        {isShown ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}
