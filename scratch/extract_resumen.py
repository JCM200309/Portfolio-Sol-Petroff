import sys
import os

pdf_path = 'public/narrativa/ferranAdria/resumen.pdf'
out_path = 'scratch/resumen_text.txt'

print(f"Reading PDF from: {pdf_path}")
print(f"Outputting to: {out_path}")

try:
    import pypdf
    print("Found pypdf")
    reader = pypdf.PdfReader(pdf_path)
    text = ""
    for idx, page in enumerate(reader.pages):
        text += f"\n--- Page {idx + 1} ---\n"
        text += page.extract_text() or ""
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(text)
    print("Extraction successful via pypdf!")
    sys.exit(0)
except ImportError:
    print("pypdf not found, trying PyPDF2")

try:
    import PyPDF2
    print("Found PyPDF2")
    reader = PyPDF2.PdfReader(pdf_path)
    text = ""
    for idx, page in enumerate(reader.pages):
        text += f"\n--- Page {idx + 1} ---\n"
        text += page.extract_text() or ""
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(text)
    print("Extraction successful via PyPDF2!")
    sys.exit(0)
except ImportError:
    print("PyPDF2 not found, trying fitz (PyMuPDF)")

try:
    import fitz # PyMuPDF
    print("Found fitz")
    doc = fitz.open(pdf_path)
    text = ""
    for idx, page in enumerate(doc):
        text += f"\n--- Page {idx + 1} ---\n"
        text += page.get_text() or ""
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(text)
    print("Extraction successful via fitz!")
    sys.exit(0)
except ImportError:
    print("fitz not found, trying pdfminer")

try:
    from pdfminer.high_level import extract_text
    print("Found pdfminer")
    text = extract_text(pdf_path)
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(text)
    print("Extraction successful via pdfminer!")
    sys.exit(0)
except ImportError:
    print("pdfminer not found.")

print("No PDF extraction libraries found. Let's list packages...")
import subprocess
try:
    res = subprocess.run([sys.executable, '-m', 'pip', 'list'], capture_output=True, text=True)
    print(res.stdout[:2000])
except Exception as e:
    print(f"Error listing pip: {e}")
