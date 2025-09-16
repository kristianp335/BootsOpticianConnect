#!/usr/bin/env python3
"""
Create Scottish Power collection ZIP with proper structure
"""
import os
import zipfile
from pathlib import Path

def create_sp_collection_zip():
    """Create ZIP for Scottish Power collection"""
    source_dir = Path("fragment-collection/scottish-power-collection")
    output_path = Path("deployments/scottish-power-collection.zip")
    
    # Ensure output directory exists
    output_path.parent.mkdir(exist_ok=True)
    
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        
        # Add collection.json first
        collection_json = source_dir / "collection.json"
        if collection_json.exists():
            zip_file.write(collection_json, "scottish-power-collection/collection.json")
        
        # Add all fragments
        fragments_dir = source_dir / "fragments"
        if fragments_dir.exists():
            for file_path in fragments_dir.rglob('*'):
                if file_path.is_file():
                    # Create archive path with collection name prefix
                    archive_path = f"scottish-power-collection/{file_path.relative_to(source_dir)}"
                    zip_file.write(file_path, archive_path)
    
    print(f"✅ Created Scottish Power collection ZIP: {output_path}")
    print(f"📦 Size: {output_path.stat().st_size} bytes")
    
    # Verify ZIP contents
    with zipfile.ZipFile(output_path, 'r') as zip_file:
        files = zip_file.namelist()
        print(f"📋 Contains {len(files)} files")
        print("📁 Root structure:", [f for f in files if f.count('/') == 1])
    
    return output_path

if __name__ == "__main__":
    create_sp_collection_zip()