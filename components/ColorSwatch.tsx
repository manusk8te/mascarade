'use client'

interface ColorSwatchProps {
  colorHex: string
  colorName: string
  isSelected: boolean
  onClick: () => void
}

export default function ColorSwatch({
  colorHex,
  colorName,
  isSelected,
  onClick,
}: ColorSwatchProps) {
  return (
    <button
      onClick={onClick}
      title={colorName}
      style={{
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        backgroundColor: colorHex,
        cursor: 'pointer',
        border: 'none',
        padding: 0,
        outline: isSelected ? '1px solid #000000' : '1px solid transparent',
        outlineOffset: '2px',
        transition: 'outline 0.15s ease',
        flexShrink: 0,
      }}
    />
  )
}
