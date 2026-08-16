const CPF_RE = /^\d{11}$/;
const PLATE_OLD_RE = /^[A-Z]{3}\d{4}$/;
const PLATE_MERCOSUL_RE = /^[A-Z]{3}\d[A-Z]\d{2}$/;

export function normalizeDigits(value) { return String(value ?? '').replace(/\D/g, ''); }
export function normalizePlate(value) { return String(value ?? '').toUpperCase().replace(/[^A-Z0-9]/g, ''); }

export function validateCpf(value) {
  const digits = normalizeDigits(value);
  if (!CPF_RE.test(digits)) return { ok: false, reason: 'CPF deve conter 11 dígitos' };
  if (/^(\d)\1{10}$/.test(digits)) return { ok: false, reason: 'CPF com dígitos repetidos' };
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(digits[i]) * (10 - i);
  let check = (sum * 10) % 11; if (check === 10) check = 0;
  if (check !== Number(digits[9])) return { ok: false, reason: 'primeiro dígito verificador inválido' };
  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(digits[i]) * (11 - i);
  check = (sum * 10) % 11; if (check === 10) check = 0;
  if (check !== Number(digits[10])) return { ok: false, reason: 'segundo dígito verificador inválido' };
  return { ok: true, value: digits };
}

export function validatePlate(value) {
  const plate = normalizePlate(value);
  if (PLATE_OLD_RE.test(plate) || PLATE_MERCOSUL_RE.test(plate)) return { ok: true, value: plate };
  return { ok: false, reason: 'placa deve ser ABC1234 ou ABC1D23' };
}

export function validateField(field, value) {
  if (field === 'cpf') return validateCpf(value);
  if (field === 'placa') return validatePlate(value);
  if (!String(value ?? '').trim()) return { ok: false, reason: 'valor vazio' };
  return { ok: true, value: String(value).trim() };
}
