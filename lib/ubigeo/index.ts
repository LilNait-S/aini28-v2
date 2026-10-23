import data from "./ubigeo.json";

/**
 * Peru INEI ubigeo (25 departments, 196 provinces, 1893 districts), the same
 * list the Plush system uses. Source: jmcastagnetto/ubigeo-peru-aumentado
 * (MIT). Codes nest: department "15", province "1501", district "150122".
 */
export interface UbigeoOption {
  code: string;
  name: string;
}

function options(rows: string[][]): UbigeoOption[] {
  return rows.map(([code = "", name = ""]) => ({ code, name }));
}
const byName = (a: UbigeoOption, b: UbigeoOption) =>
  a.name.localeCompare(b.name, "es");

const departments = options(data.departments).sort(byName);
const provinces = options(data.provinces);
const districts = options(data.districts);
const names = new Map(
  [...departments, ...provinces, ...districts].map((o) => [o.code, o.name]),
);

/** Motorbike delivery covers Lima Metropolitana (1501) and Callao (0701). */
export const motorbikeProvinces = ["1501", "0701"] as const;

export function isMotorbikeDistrict(code: string) {
  return /^(1501|0701)\d{2}$/.test(code);
}

export function listDepartments() {
  return departments;
}

export function listProvinces(department: string) {
  return provinces
    .filter((o) => o.code.slice(0, 2) === department)
    .sort(byName);
}

export function listDistricts(province: string) {
  return districts.filter((o) => o.code.slice(0, 4) === province).sort(byName);
}

export function listMotorbikeProvinces() {
  return provinces.filter((o) =>
    (motorbikeProvinces as readonly string[]).includes(o.code),
  );
}

export function isDistrict(code: string) {
  return code.length === 6 && names.has(code);
}

/** "Miraflores, Lima, Lima" for a district code ("" when unknown). */
export function ubigeoLabel(district: string) {
  if (!isDistrict(district)) return "";
  return [
    names.get(district),
    names.get(district.slice(0, 4)),
    names.get(district.slice(0, 2)),
  ].join(", ");
}
