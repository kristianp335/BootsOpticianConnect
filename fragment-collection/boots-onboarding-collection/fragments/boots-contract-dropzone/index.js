// Boots Contract Dropzone Fragment JavaScript
// Hide dropzone when not in edit mode - shown by completed onboarding tasks

if (layoutMode !== 'edit') {
    const contractDropZone = fragmentElement.querySelector('#contractDropZone');
    if (contractDropZone) {
        contractDropZone.style.display = 'none';
    }
}