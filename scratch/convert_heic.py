import sys
import os
import subprocess

# Ensure pillow-heif is installed
try:
    from pillow_heif import register_heif_opener
    register_heif_opener()
    print("pillow-heif is already installed.")
except ImportError:
    print("Installing pillow-heif...")
    subprocess.run([sys.executable, "-m", "pip", "install", "pillow-heif", "pillow"], check=True)
    from pillow_heif import register_heif_opener
    register_heif_opener()

from PIL import Image

# Resolve path relative to script directory
script_dir = os.path.dirname(os.path.abspath(__file__))
workspace_dir = os.path.dirname(script_dir)
backstage_dir = os.path.join(workspace_dir, 'public', 'proyectosAudiovisuales', 'neoTrattoria', 'BACKSTAGE')

if not os.path.exists(backstage_dir):
    print(f"Directory not found: {backstage_dir}")
    sys.exit(1)

files = os.listdir(backstage_dir)
heic_files = [f for f in files if f.lower().endswith('.heic')]

if not heic_files:
    print("No HEIC files found to convert.")
    sys.exit(0)

for f in heic_files:
    heic_path = os.path.join(backstage_dir, f)
    jpg_filename = os.path.splitext(f)[0] + '.jpg'
    jpg_path = os.path.join(backstage_dir, jpg_filename)
    
    print(f"Converting: {heic_path} -> {jpg_path}")
    try:
      image = Image.open(heic_path)
      image.save(jpg_path, "JPEG", quality=90)
      print(f"Successfully converted {f}")
    except Exception as e:
      print(f"Error converting {f}: {e}")

print("HEIC conversion process completed.")
sys.exit(0)
