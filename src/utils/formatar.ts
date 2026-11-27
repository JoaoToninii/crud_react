// Tira tudo que não é dígito: "(16) 3333-4444" vira "1633334444".
export function somenteDigitos(texto?: string): string {
  return (texto ?? '').replace(/\D/g, '');
}

// "11122233344" vira "111.222.333-44". Se não tiver 11 dígitos, devolve como veio.
export function formatarCpf(cpf?: string): string {
  const d = somenteDigitos(cpf);
  if (d.length !== 11) {
    return cpf ?? '';
  }
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

// "33334444" vira "3333-4444"; com DDD, "(16) 3333-4444".
export function formatarTelefone(ddd?: string, numero?: string): string {
  const n = somenteDigitos(numero);
  if (!n) {
    return '';
  }
  const corte = n.length - 4;
  const meio = `${n.slice(0, corte)}-${n.slice(corte)}`;
  return ddd ? `(${somenteDigitos(ddd)}) ${meio}` : meio;
}

// O caminho inverso: "(16) 3333-4444" vira { ddd: "16", numero: "33334444" }.
export function separarTelefone(texto: string): { ddd: string; numero: string } {
  const d = somenteDigitos(texto);
  if (d.length < 10) {
    return { ddd: '', numero: d };
  }
  return { ddd: d.slice(0, 2), numero: d.slice(2) };
}
