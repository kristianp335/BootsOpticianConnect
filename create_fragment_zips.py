#!/usr/bin/env python3
"""
Script to create Boots Partner Portal fragment deployment ZIPs
Creates both individual fragment ZIPs and collection ZIP
"""

import os
import zipfile
import json
from pathlib import Path

def create_fragment_zip(fragment_name, source_dir, output_dir):
    """Create ZIP for individual fragment"""
    zip_path = output_dir / f"{fragment_name}.zip"
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        fragment_dir = source_dir / fragment_name
        
        for file_path in fragment_dir.rglob('*'):
            if file_path.is_file():
                # Create archive path relative to fragment name
                archive_path = f"{fragment_name}/{file_path.relative_to(fragment_dir)}"
                zip_file.write(file_path, archive_path)
    
    return zip_path

def create_collection_zip(source_dir, output_path):
    """Create ZIP for entire collection"""
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        
        # Add collection.json first
        collection_json = source_dir / "collection.json"
        if collection_json.exists():
            zip_file.write(collection_json, "boots-partner-collection/collection.json")
        
        # Add all fragment directories
        fragment_dirs = [d for d in source_dir.iterdir() if d.is_dir() and d.name.startswith('boots-')]
        
        for fragment_dir in sorted(fragment_dirs):
            print(f"  Adding fragment: {fragment_dir.name}")
            for file_path in fragment_dir.rglob('*'):
                if file_path.is_file():
                    # Create archive path with collection name prefix
                    archive_path = f"boots-partner-collection/{file_path.relative_to(source_dir)}"
                    zip_file.write(file_path, archive_path)
    
    return output_path

def main():
    print("🚀 Creating Boots Partner Portal Fragment ZIPs")
    print("=" * 60)
    
    # Define paths
    base_dir = Path(".")
    source_dir = base_dir / "fragment-collection" / "boots-partner-collection"
    output_dir = base_dir / "fragment-zips"
    collection_zip = base_dir / "boots-partner-collection.zip"
    
    # Create output directory
    output_dir.mkdir(exist_ok=True)
    
    # Get all fragment directories
    fragment_dirs = [d for d in source_dir.iterdir() if d.is_dir() and d.name.startswith('boots-')]
    fragment_names = [d.name for d in fragment_dirs]
    
    print(f"Creating individual fragment ZIPs for {len(fragment_names)} fragments...")
    
    # Create individual fragment ZIPs
    individual_zips = []
    for fragment_name in sorted(fragment_names):
        print(f"Creating fragment-zips/{fragment_name}.zip...")
        zip_path = create_fragment_zip(fragment_name, source_dir, output_dir)
        individual_zips.append(zip_path)
        print(f"✅ Created {zip_path} ({zip_path.stat().st_size} bytes)")
    
    print(f"\nCreating collection ZIP: {collection_zip.name}...")
    create_collection_zip(source_dir, collection_zip)
    print(f"✅ Created collection ZIP: {collection_zip} ({collection_zip.stat().st_size} bytes)")
    
    print("\n🔍 Verifying ZIP file structures...")
    
    # Verify collection ZIP contents
    with zipfile.ZipFile(collection_zip, 'r') as zip_file:
        files = zip_file.namelist()
        print(f"\nCollection ZIP contents ({len(files)} files):")
        for file in sorted(files):
            print(f"  {file}")
    
    # Verify individual fragment ZIPs
    for zip_path in individual_zips:
        with zipfile.ZipFile(zip_path, 'r') as zip_file:
            files = zip_file.namelist()
            print(f"\n{zip_path.name} contents ({len(files)} files):")
            for file in sorted(files):
                print(f"  {file}")
    
    print("\n✅ All ZIP files created successfully!")
    print("\nDeployment files ready:")
    print("- Individual fragments: fragment-zips/*.zip")
    print("- Complete collection: boots-partner-collection.zip")

if __name__ == "__main__":
    main()