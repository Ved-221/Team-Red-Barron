import fs from "fs/promises";
import path from "path";

export interface SponsorTestimonial {
  id: string;
  quote: string;
  name: string;
  company: string;
  tier: string;
  website_url?: string;
  sort_order: number;
}

const TESTIMONIALS_FILE = path.join(process.cwd(), "src", "data", "testimonials.json");

export async function getTestimonials(): Promise<SponsorTestimonial[]> {
  try {
    const raw = await fs.readFile(TESTIMONIALS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    }
  } catch (err) {
    // If file doesn't exist, return empty array
  }
  return [];
}

export async function saveTestimonial(data: Omit<SponsorTestimonial, "id"> & { id?: string }): Promise<SponsorTestimonial[]> {
  const current = await getTestimonials();
  const id = data.id || `testimonial-${Date.now()}`;
  
  const existingIdx = current.findIndex(t => t.id === id);
  const record: SponsorTestimonial = {
    id,
    quote: data.quote.trim(),
    name: data.name.trim(),
    company: data.company.trim(),
    tier: data.tier.trim(),
    website_url: data.website_url ? data.website_url.trim() : "",
    sort_order: Number.isFinite(data.sort_order) ? data.sort_order : current.length,
  };

  if (existingIdx >= 0) {
    current[existingIdx] = record;
  } else {
    current.push(record);
  }

  current.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  await fs.mkdir(path.dirname(TESTIMONIALS_FILE), { recursive: true });
  await fs.writeFile(TESTIMONIALS_FILE, JSON.stringify(current, null, 2), "utf-8");
  return current;
}

export async function removeTestimonial(id: string): Promise<SponsorTestimonial[]> {
  const current = await getTestimonials();
  const filtered = current.filter(t => t.id !== id);
  await fs.mkdir(path.dirname(TESTIMONIALS_FILE), { recursive: true });
  await fs.writeFile(TESTIMONIALS_FILE, JSON.stringify(filtered, null, 2), "utf-8");
  return filtered;
}
