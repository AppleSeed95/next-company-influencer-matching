"use client";
import { ReCaptchaProvider } from "next-recaptcha-v3";
import React from "react";

export default function GoogleCaptchaWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const recaptchaKey: string | undefined =
        process?.env?.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    return (
        <ReCaptchaProvider
            reCaptchaKey={recaptchaKey ?? "NOT DEFINED"}
        >
            {children}
        </ReCaptchaProvider>
    );
}