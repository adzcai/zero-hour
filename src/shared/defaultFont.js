export default function defaultFont(size = 18, width) {
  const style = {
    fontFamily: 'future',
    fontSize: `${Math.floor(size)}px`,
    fill: '#ffffff',
    align: 'center',
  };
  if (width) style.wordWrap = { width, useAdvancedWrap: true };
  return style;
}
