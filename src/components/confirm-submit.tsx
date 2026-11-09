"use client";

import type { ComponentProps } from "react";

/** Botão de envio que pede confirmação antes de ações destrutivas. */
export function ConfirmSubmit({ message, ...p }: ComponentProps<"button"> & { message: string }) {
  return (
    <button
      type="submit"
      {...p}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    />
  );
}
