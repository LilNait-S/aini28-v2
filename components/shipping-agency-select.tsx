"use client";
import { useEffect, useId, useState } from "react";
import { shippingAgenciesSchema, type ShippingAgency } from "@/types/shipping";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ShippingAgencySelect({value, onChange}: {value: ShippingAgency | null; onChange: (value: ShippingAgency | null) => void}) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ShippingAgency[]>([]);
  const [status, setStatus] = useState("idle");
  useEffect(() => {
    const controller = new AbortController();
    setResults([]);
    if (query.trim().length < 2) {setStatus("idle"); return;}
    setStatus("loading");
    const timer = setTimeout(() => {
      fetch(`/api/shipping-agencies?q=${encodeURIComponent(query.trim())}`, {signal: controller.signal}).then(async response => {
        if (!response.ok) throw new Error("directory");
        return shippingAgenciesSchema.parse(await response.json());
      }).then(data => {if (!controller.signal.aborted) {setResults(data.agencies); setStatus("ready");}}).catch(() => {if (!controller.signal.aborted) setStatus("error");});
    }, 350);
    return () => {clearTimeout(timer); controller.abort();};
  }, [query]);
  return <div className="space-y-2"><label htmlFor={id} className="text-sm font-medium">Agencia Shalom de destino</label>{value ? <div className="rounded-md border p-3 text-sm"><strong>{value.name}</strong><p>{value.province} · {value.district}</p><p>{value.address}</p><Button variant="outline" type="button" className="mt-2" onClick={() => {onChange(null); setQuery("");}}>Cambiar agencia</Button></div> : <><Input id={id} placeholder="Ciudad, sede o dirección: truji amer" value={query} onChange={e => setQuery(e.target.value)} maxLength={100} autoComplete="off" /><p className="text-xs text-muted-foreground">Elige la sede y revisa su dirección completa.</p>{status === "loading" ? <p role="status" className="text-sm">Buscando…</p> : null}{status === "error" ? <p role="alert" className="text-sm">No se pudo consultar el directorio. Cambia la búsqueda o indica tu sede para revisión.</p> : null}{status === "ready" ? <ul className="max-h-72 overflow-auto rounded-md border divide-y">{results.map(agency => <li key={agency.id}><button className="w-full p-3 text-left text-sm hover:bg-muted focus:bg-muted" type="button" onClick={() => onChange(agency)}><strong>{agency.name}</strong><p>{agency.department} · {agency.province} · {agency.district}</p><p>{agency.address}</p></button></li>)}{!results.length ? <li className="p-3 text-sm">Sin resultados. Prueba con otra parte del nombre.</li> : null}{results.length === 40 ? <li className="p-3 text-xs">Añade la sede o dirección para precisar la búsqueda.</li> : null}</ul> : null}</>}</div>;
}
