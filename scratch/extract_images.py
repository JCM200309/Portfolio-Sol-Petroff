import sys
import os
import subprocess

# Ensure libraries are installed
try:
    import fitz  # PyMuPDF
    print("PyMuPDF (fitz) is already installed.")
except ImportError:
    print("Installing PyMuPDF...")
    subprocess.run([sys.executable, "-m", "pip", "install", "pymupdf"], check=True)
    import fitz

pdf_path = 'public/narrativa/ferranAdria/resumen.pdf'
output_dir = 'public/narrativa/ferranAdria'

os.makedirs(output_dir, exist_ok=True)

print(f"Opening PDF: {pdf_path}")
doc = fitz.open(pdf_path)

for page_num in range(len(doc)):
    page = doc.load_page(page_num)
    # Render page to a high-resolution image (300 DPI / 4x zoom for crispness)
    zoom = 4
    mat = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat)
    
    output_filename = f"page_{page_num + 1}.png"
    output_path = os.path.join(output_dir, output_filename)
    pix.save(output_path)
    print(f"Saved: {output_path}")

print("Extraction completed successfully!")
sys.exit(0)
