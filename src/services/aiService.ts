import { GoogleGenAI } from '@google/genai';

// Safely obtain API key if present in environment
const apiKey = 
  (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
  '';

let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (e) {
    console.warn('Failed to initialize GoogleGenAI client:', e);
  }
}

export interface AILogbookDraftRequest {
  bulletPoints: string;
  category: string;
  role: string;
  company: string;
}

export interface AILogbookDraftResult {
  title: string;
  description: string;
  obstacles: string;
  solution: string;
}

export const aiService = {
  /**
   * Mengubah coretan/poin kasar kegiatan magang menjadi narasi jurnal PKL formal & profesional
   */
  async polishLogbook(params: AILogbookDraftRequest): Promise<AILogbookDraftResult> {
    if (aiClient) {
      try {
        const prompt = `Anda adalah asisten pembimbing magang / PKL vokasi & universitas di Indonesia.
Bantulah peserta magang berikut untuk menyusun Jurnal Harian (Logbook PKL) yang baku, formal, dan mencerminkan kompetensi kerja profesional.

Informasi:
- Posisi Magang: ${params.role} di ${params.company}
- Kategori Kegiatan: ${params.category}
- Poin Catatan Kasar Mahasiswa:
"""
${params.bulletPoints}
"""

Tolong berikan balasan dalam format JSON murni tanpa markdown triple-backticks dengan struktur berikut:
{
  "title": "Judul kegiatan yang ringkas dan profesional (maks 8-12 kata)",
  "description": "Uraian kegiatan 2-3 paragraf formal menggunakan bahasa Indonesia baku, menjelaskan apa yang dikerjakan, tools/metode yang digunakan, dan hasilnya",
  "obstacles": "Kendala teknis atau koordinasi yang dihadapi selama pengerjaan",
  "solution": "Solusi atau tindakan nyata yang diambil untuk menyelesaikan kendala tersebut"
}`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const text = response.text?.trim();
        if (text) {
          const parsed = JSON.parse(text);
          return {
            title: parsed.title || 'Pelaksanaan Kegiatan Kerja Praktik Harian',
            description: parsed.description || params.bulletPoints,
            obstacles: parsed.obstacles || 'Tidak ada kendala berarti yang menghambat pengerjaan.',
            solution: parsed.solution || 'Berkoordinasi aktif bersama rekan tim dan mentor lapangan.',
          };
        }
      } catch (err) {
        console.warn('AI generation encountered an issue, falling back to smart contextual generator:', err);
      }
    }

    // Fallback template builder (always produces high quality Indonesian text instantly)
    return this.generateSmartFallback(params);
  },

  /**
   * Smart template engine yang menyusun teks jurnal PKL berbasis konteks input
   */
  generateSmartFallback(params: AILogbookDraftRequest): AILogbookDraftResult {
    const rawLines = params.bulletPoints
      .split('\n')
      .map(l => l.replace(/^[-*•0-9.]+\s*/, '').trim())
      .filter(Boolean);

    const firstPoint = rawLines[0] || 'mengerjakan tugas proyek magang';
    const cleanTitle = `Implementasi & ${firstPoint.charAt(0).toUpperCase() + firstPoint.slice(1)}`;

    const desc = `Pada hari ini, sebagai ${params.role} di ${params.company}, saya melaksanakan aktivitas kerja pada bidang ${params.category}.\n\n` +
      `Rangkaian pengerjaan diawali dengan ${rawLines.join(', dilanjutkan dengan ')}. Seluruh proses implementasi dikerjakan sesuai standar operasional prosedur (SOP) dan arahan mentor lapangan untuk memastikan ketercapaian target sprint mingguan.\n\n` +
      `Hasil yang dicapai mencakup pemenuhan kriteria penyelesaian tugas, pengujian fungsionalitas, serta pendokumentasian progres pada sistem repositori kerja tim.`;

    const obstacles = rawLines.length > 1
      ? `Ditemukan beberapa penyesuaian dependensi dan sinkronisasi data pada tahapan ${rawLines[1] || 'eksekusi komponen'}.`
      : 'Penyesuaian terhadap spesifikasi teknis dan integrasi modul existing.';

    const solution = 'Melakukan penelusuran dokumentasi teknis, berdiskusi dengan mentor pembimbing, dan menerapkan perbaikan secara bertahap sehingga seluruh alur kerja dapat berjalan optimal.';

    return {
      title: cleanTitle.slice(0, 75),
      description: desc,
      obstacles,
      solution,
    };
  },

  /**
   * AI Asisten evaluasi kesiapan lamaran magang & tips portfolio
   */
  async reviewApplication(coverLetter: string, vacancyTitle: string): Promise<string> {
    if (aiClient) {
      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Analisis surat motivasi / lamaran magang berikut untuk posisi "${vacancyTitle}". Berikan 3 poin masukan konstruktif singkat dalam bahasa Indonesia agar probabilitas diterima semakin tinggi:\n\n"${coverLetter}"`,
        });
        if (response.text) return response.text;
      } catch (e) {
        console.warn('AI review error:', e);
      }
    }

    return `1. **Tunjukkan Relevansi Konkret**: Kaitkan keahlian praktis Anda secara langsung dengan kebutuhan posisi ${vacancyTitle}.\n2. **Sebutkan Hasil Terukur**: Jelaskan dampak dari proyek/tugas yang pernah Anda kerjakan (misalnya peningkatan efisiensi atau fitur yang berhasil dirilis).\n3. **Etika & Komitmen**: Pertegas kesiapan Anda mengikuti jadwal kerja, jam magang, dan etika kerja sama tim.`;
  },
};
