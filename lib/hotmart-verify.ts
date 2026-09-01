// Verificación de autenticidad del webhook de Hotmart — ver docs/sistema/18-VENTA-HOTMART.md
// "SEGURIDAD DEL WEBHOOK DE HOTMART". El hottok es un secreto compartido que viaja en cada
// petición sobre HTTPS; NO es una firma HMAC — se compara en tiempo constante.
import crypto from 'node:crypto';

// Fail-secure: si falta el secreto, el arranque revienta (nunca corre con un default de juguete).
const HOTTOK = process.env.HOTMART_HOTTOK;
if (!HOTTOK) throw new Error('FALTA HOTMART_HOTTOK — el webhook no puede operar de forma segura');

function timingSafeEqualStr(a: string, b: string): boolean {
  const ba = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

export function verifyHotmart(opts: { hottok?: string }): boolean {
  if (!opts.hottok) return false;
  return timingSafeEqualStr(opts.hottok, HOTTOK!);
}
