import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El overlay de dev (badge circular "N") tapaba contenido real en las capturas de
  // 375px usadas para la revisión de calidad — apagado para que las capturas reflejen
  // exactamente lo que ve el usuario, nunca herramientas de desarrollo.
  devIndicators: false,
};

export default nextConfig;
