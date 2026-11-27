// O que vem dentro do JWT emitido pelo app-login.
export interface ClaimsJwt {
  condominios?: string[];
  condomino?: string;
  nome?: string;
  exp?: number;
  iat?: number;
}

// Um JWT tem três partes separadas por ponto: cabeçalho.conteúdo.assinatura.
// O conteúdo (a parte do meio) é só JSON em Base64URL: qualquer um LÊ.
// Alterar não adianta: a assinatura deixa de bater e o servidor recusa.
export function lerClaims(token: string): ClaimsJwt {
  const meio = token.split('.')[1] ?? '';
  const base64 = meio.replace(/-/g, '+').replace(/_/g, '/');
  const completo = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  return JSON.parse(atob(completo));
}

// exp está em segundos desde 1970; Date.now() devolve milissegundos.
export function tokenExpirado(token: string): boolean {
  try {
    const { exp } = lerClaims(token);
    return !exp || Date.now() / 1000 >= exp;
  } catch {
    return true;
  }
}
