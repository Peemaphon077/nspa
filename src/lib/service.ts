export type Service = {
  id: string;
  name: string;
  price: number;
  duration_min: number;
  description: string | null;
  is_active: boolean;
};

const BASE = import.meta.env.VITE_SUPABASE_URL!;
const KEY  = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export async function fetchServices(): Promise<Service[]> {
  const url = `${BASE}/rest/v1/services?select=id,name,price,duration_min,description,is_active&order=created_at.asc`;
  const res = await fetch(url, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch services (${res.status})`);
  const data = (await res.json()) as Service[];
  return data;
}
