"use client"

import { useEffect, useRef } from "react"

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

/** true si el CAPTCHA está configurado (hay site key pública). */
export const captchaEnabled = !!SITE_KEY

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js"

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    turnstile?: any
  }
}

/**
 * Widget de Cloudflare Turnstile. Renderiza nada si no hay
 * NEXT_PUBLIC_TURNSTILE_SITE_KEY (así el formulario sigue funcionando sin
 * configurar el CAPTCHA). Cuando el usuario pasa el reto, entrega el token
 * mediante `onToken`; si expira o falla, entrega "".
 */
export function Turnstile({ onToken }: { onToken: (token: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  // Guardamos el callback en una ref para no re-ejecutar el efecto al cambiar.
  const onTokenRef = useRef(onToken)
  onTokenRef.current = onToken

  useEffect(() => {
    if (!SITE_KEY) return

    const renderWidget = () => {
      if (!window.turnstile || !containerRef.current || widgetIdRef.current) {
        return
      }
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        callback: (token: string) => onTokenRef.current(token),
        "error-callback": () => onTokenRef.current(""),
        "expired-callback": () => onTokenRef.current(""),
      })
    }

    if (window.turnstile) {
      renderWidget()
    } else {
      let script = document.querySelector<HTMLScriptElement>(
        `script[src="${SCRIPT_SRC}"]`
      )
      if (!script) {
        script = document.createElement("script")
        script.src = SCRIPT_SRC
        script.async = true
        script.defer = true
        document.head.appendChild(script)
      }
      script.addEventListener("load", renderWidget)
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [])

  if (!SITE_KEY) return null

  return <div ref={containerRef} className="my-2" />
}
