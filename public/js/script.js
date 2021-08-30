const DOM = {
    inputFile: document.querySelector(".input-file"),
    addFileButton: document.querySelector('[aria-controls=add-file]'),
    fileSelected: document.querySelector(".file-selected"),
    previewFile: document.querySelector(".preview")
}

DOM.inputFile.addEventListener('change', () => {
    let files = DOM.inputFile.files
    files = Object.keys(files).map(key => {
        return files[key];
    })
    DOM.fileSelected.innerHTML = `${files.length} selected`

    for(let index in files) {
        const file = files[index]
        const template = `${file.name}`
        const domElement = document.createElement('div')
        domElement.innerHTML = template
        domElement.setAttribute('data-index', index)
        DOM.previewFile.appendChild(domElement)
    }
})


