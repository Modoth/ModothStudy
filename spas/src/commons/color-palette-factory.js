export class ColorPaletteFactory {
  create(colors, selectedColor, onSelect) {
    const root = document.createElement('div')
    root.style.display = 'flex'
    root.style.alignItems = 'center'
    root.onclick = () => onSelect && onSelect(null)
    const shadow = root.attachShadow({ mode: 'closed' })
    const palette = document.createElement('div')
    shadow.appendChild(palette)
    palette.classList.add('palette')
    const style = document.createElement('style')
    shadow.appendChild(style)
    style.innerHTML = `:root{
--color:#fff
}

.palette{
  width: 80%;
  align-content: space-between;
  padding: 10px;
  margin: 10px 10%;
  background: #fff8;
  backdrop-filter: blur(5px);
  border-radius: 8px;
  display: flex;
  flex-wrap: wrap;
  max-height: 60vh;
  overflow: auto;
  background: #fffe;
}

.palette>div {
  width: 17%;
  height: 48px;
  margin: 10px auto;
  border-radius: 8px;
  box-shadow: 1px 1px 1px #000c;
}
.palette>div.selected{
  box-shadow: 1px 1px 3px #0087ff;
}`
    colors.forEach((c) => {
      const cell = document.createElement('div')
      cell.style.backgroundColor = c
      if (c === selectedColor) {
        cell.classList.add('selected')
      }
      palette.appendChild(cell)
      cell.onclick = (ev) => {
        ev.stopPropagation()
        onSelect && onSelect(c)
      }
    })
    return root
  }
}
