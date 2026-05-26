import os
from PIL import Image

def compress_image(filepath, max_size=1920, quality=80):
    try:
        # Check file size before processing
        orig_size = os.path.getsize(filepath)
        
        # Determine if we should convert PNG to JPG
        filename = os.path.basename(filepath)
        is_png = filepath.lower().endswith('.png')
        should_convert = is_png and (
            filename == '1.png' or 
            filename == 'portada.png' or 
            'Portada.png' in filename
        )
        
        im = Image.open(filepath)
        width, height = im.size
        
        # Resize if width or height exceeds max_size
        if width > max_size or height > max_size:
            if width > height:
                new_width = max_size
                new_height = int(height * (max_size / width))
            else:
                new_height = max_size
                new_width = int(width * (max_size / height))
            im = im.resize((new_width, new_height), Image.Resampling.LANCZOS)
            print(f"Resized {filepath}: {width}x{height} -> {new_width}x{new_height}")
        
        if should_convert:
            # Convert to RGB (since JPEG doesn't support alpha channel)
            if im.mode in ('RGBA', 'LA'):
                background = Image.new('RGB', im.size, (246, 237, 222)) # Use cream background (#f6edde)
                background.paste(im, mask=im.split()[3]) # 3 is the alpha channel
                im = background
            else:
                im = im.convert('RGB')
                
            new_filepath = os.path.splitext(filepath)[0] + '.jpg'
            im.save(new_filepath, 'JPEG', quality=quality, optimize=True, progressive=True)
            new_size = os.path.getsize(new_filepath)
            os.remove(filepath) # Remove the original PNG
            print(f"Converted & Compressed PNG -> JPG: {filepath} -> {new_filepath}")
            print(f"  Size reduced from {orig_size/1024/1024:.2f} MB to {new_size/1024/1024:.2f} MB")
            return new_filepath
        else:
            # Optimize existing JPG or keep format
            save_format = im.format
            if save_format is None:
                if filepath.lower().endswith(('.jpg', '.jpeg', '.jpg')):
                    save_format = 'JPEG'
                elif filepath.lower().endswith('.png'):
                    save_format = 'PNG'
                elif filepath.lower().endswith('.webp'):
                    save_format = 'WEBP'
            
            if save_format == 'JPEG':
                im.save(filepath, 'JPEG', quality=quality, optimize=True, progressive=True)
            elif save_format == 'WEBP':
                im.save(filepath, 'WEBP', quality=quality)
            else:
                # If PNG and not converting, optimize
                im.save(filepath, save_format, optimize=True)
                
            new_size = os.path.getsize(filepath)
            print(f"Compressed {filepath}: {orig_size/1024/1024:.2f} MB -> {new_size/1024/1024:.2f} MB")
            return filepath
            
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return filepath

def walk_and_compress(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            ext = file.lower()
            if ext.endswith(('.jpg', '.jpeg', '.png', '.webp')):
                # Skip logo since it might need transparency and is already small
                if file.lower() == 'logo.png':
                    continue
                filepath = os.path.join(root, file)
                # Only process files larger than 150KB
                if os.path.getsize(filepath) > 150 * 1024:
                    compress_image(filepath)

if __name__ == '__main__':
    public_dir = os.path.join(os.path.dirname(__file__), 'public')
    print(f"Starting image compression in: {public_dir}")
    walk_and_compress(public_dir)
    print("Done compression!")
