#!/usr/bin/env python3
"""
Create Liferay fragment collection and individual fragment ZIP files
Following proper Liferay deployment structure requirements
"""

import os
import zipfile
from pathlib import Path

def create_individual_fragment_zips():
    """Create individual ZIP files for each fragment"""
    
    fragment_dir = Path("fragment-collection/boots-partner-collection")
    output_dir = Path("fragment-zips")
    output_dir.mkdir(exist_ok=True)
    
    # Get all fragment directories (excluding collection.json)
    fragments = [d for d in fragment_dir.iterdir() 
                if d.is_dir() and d.name.startswith('boots-')]
    
    print(f"Creating individual fragment ZIPs for {len(fragments)} fragments...")
    
    for fragment in fragments:
        fragment_name = fragment.name
        zip_path = output_dir / f"{fragment_name}.zip"
        
        print(f"Creating {zip_path}...")
        
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
            # Add all files from the fragment directory
            for file_path in fragment.rglob('*'):
                if file_path.is_file():
                    # Create relative path within fragment directory
                    relative_path = file_path.relative_to(fragment)
                    # Add to zip with fragment name as root
                    arc_path = f"{fragment_name}/{relative_path}"
                    zf.write(file_path, arc_path)
                    
        print(f"✅ Created {zip_path} ({zip_path.stat().st_size} bytes)")


def create_collection_zip():
    """Create complete fragment collection ZIP with proper structure"""
    
    collection_dir = Path("fragment-collection/boots-partner-collection")
    zip_path = Path("boots-partner-collection.zip")
    
    print(f"Creating collection ZIP: {zip_path}...")
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        # Add collection.json at root level of collection
        collection_json = collection_dir / "collection.json"
        if collection_json.exists():
            zf.write(collection_json, "boots-partner-collection/collection.json")
            
        # Add all fragment directories
        fragments = [d for d in collection_dir.iterdir() 
                    if d.is_dir() and d.name.startswith('boots-')]
        
        for fragment in fragments:
            fragment_name = fragment.name
            print(f"  Adding fragment: {fragment_name}")
            
            # Add all files from the fragment directory
            for file_path in fragment.rglob('*'):
                if file_path.is_file():
                    # Create proper collection structure path
                    relative_path = file_path.relative_to(collection_dir)
                    arc_path = f"boots-partner-collection/{relative_path}"
                    zf.write(file_path, arc_path)
                    
    print(f"✅ Created collection ZIP: {zip_path} ({zip_path.stat().st_size} bytes)")
    

def verify_zip_structure():
    """Verify the created ZIP files have correct structure"""
    
    print("\n🔍 Verifying ZIP file structures...")
    
    # Check collection ZIP
    collection_zip = Path("boots-partner-collection.zip")
    if collection_zip.exists():
        with zipfile.ZipFile(collection_zip, 'r') as zf:
            files = zf.namelist()
            print(f"\nCollection ZIP contents ({len(files)} files):")
            for f in sorted(files):
                print(f"  {f}")
    
    # Check individual fragment ZIPs
    fragment_zips = list(Path("fragment-zips").glob("*.zip"))
    for zip_path in fragment_zips:
        with zipfile.ZipFile(zip_path, 'r') as zf:
            files = zf.namelist()
            print(f"\n{zip_path.name} contents ({len(files)} files):")
            for f in sorted(files):
                print(f"  {f}")


if __name__ == "__main__":
    print("🚀 Creating Boots Partner Portal Fragment ZIPs")
    print("="*60)
    
    # Create individual fragment ZIPs
    create_individual_fragment_zips()
    
    print()
    
    # Create complete collection ZIP
    create_collection_zip()
    
    # Verify structure
    verify_zip_structure()
    
    print("\n✅ All ZIP files created successfully!")
    print("\nDeployment files ready:")
    print("- Individual fragments: fragment-zips/*.zip")
    print("- Complete collection: boots-partner-collection.zip")