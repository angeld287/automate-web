export function getBearer() {
  return `Bearer ${localStorage.getItem('wp-token')}`
}
