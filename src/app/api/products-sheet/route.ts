export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/1ffkOmgG1WORH0hoqHzcdlTsdyhvO9q6jNOcY_kjhmH0/export?format=csv';

const BRANDS = [
  'Gucci', 'Vogue Eyewear', 'Vogue', 'Dolce & Gabbana', 'Dolce', 'Fendi', 
  'Carrera', 'Prada', 'Tom Ford', 'Armani Exchange', 'Armani', 'Tiffany & Co.', 
  'Tiffany', 'Balenciaga', 'Maui Jim', 'Burberry', 'Michael Kors', 'Ray-Ban', 
  'Coach', 'Versace', 'Persol', 'Hugo Boss', 'Saint Laurent', 'Oakley'
];

function detectBrand(name: string): string {
  for (const brand of BRANDS) {
    if (name.toLowerCase().startsWith(brand.toLowerCase())) {
      return brand;
    }
  }
  return name.split(' ')[0] || 'Genérico';
}

function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [""];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i+1];
    if (c === '"') {
      if (inQuotes && next === '"') {
        row[row.length - 1] += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push('');
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') i++;
      lines.push(row);
      row = [''];
    } else {
      row[row.length - 1] += c;
    }
  }
  if (row.length > 1 || row[0] !== '') {
    lines.push(row);
  }
  return lines;
}

export async function GET() {
  try {
    const res = await fetch(CSV_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      next: { revalidate: 60 } // Cache spreadsheet data for 1 minute
    });
    
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch spreadsheet' }, { status: 500 });
    }

    const csvText = await res.text();
    const rows = parseCSV(csvText);
    const dataRows = rows.slice(1);

    const products = dataRows.map((row, index) => {
      const name = row[0] || '';
      const categoryName = row[1] || 'General';
      const sku = row[2] || `SKU-${index}`;
      const price = parseFloat(row[3]) || parseFloat(row[7]) || 0;
      const dateInv = row[4] || '';
      const stock = parseInt(row[5], 10) || 0;
      const costPrice = parseFloat(row[6]) || 0;
      const salePrice = parseFloat(row[7]) || price || 0;

      return {
        id: sku,
        sku: sku,
        barcode: sku,
        name: name,
        description: `Producto de la categoría ${categoryName} importado desde Google Sheets.`,
        category_id: categoryName.toLowerCase().replace(/\s+/g, '-'),
        category_name: categoryName,
        brand: detectBrand(name),
        base_unit: 'unidad',
        costPrice: costPrice,
        salePrice: salePrice,
        stock: stock,
        tax_rate: 0.13,
        active: true,
        outOfStock: stock <= 0,
        date: dateInv || new Date().toISOString().split('T')[0]
      };
    }).filter(p => p.sku && p.name);

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error in products-sheet server route:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
