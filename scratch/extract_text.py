import fitz  # PyMuPDF
import os

pdf_path = 'public/narrativa/preAdolescentes/resumen.pdf'
output_txt = 'scratch/preadolescentes_text.txt'

print(f"Opening PDF: {pdf_path}")
doc = fitz.open(pdf_path)

full_text = ""
for page_num in range(len(doc)):
    page = doc.load_page(page_num)
    text = page.get_text()
    full_text += f"--- PAGE {page_num + 1} ---\n"
    full_text += text + "\n\n"

with open(output_txt, 'w', encoding='utf-8') as f:
    f.write(full_text)

print(f"Text written to: {output_txt}")
