#!/usr/bin/env python3
import zipfile
from pathlib import Path

# Create deployment ZIP for Scottish Power collection
source_dir = Path("fragment-collection/scottish-power-collection")
output_path = Path("deployments/scottish-power-collection.zip")
output_path.parent.mkdir(exist_ok=True)

with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zf:
    # Add collection.json with proper structure
    collection_json = source_dir / "collection.json"
    if collection_json.exists():
        zf.write(collection_json, "scottish-power-collection/collection.json")
    
    # Add all fragment files
    fragments_dir = source_dir / "fragments"
    if fragments_dir.exists():
        for file_path in fragments_dir.rglob('*'):
            if file_path.is_file():
                relative_path = file_path.relative_to(source_dir)
                archive_path = f"scottish-power-collection/{relative_path}"
                zf.write(file_path, archive_path)

print(f"✅ Created: {output_path} ({output_path.stat().st_size} bytes)")