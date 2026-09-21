// Patch để thêm interface ảo "All WANs (sum)" vào Reports
// Áp dụng vào reports.ts trong hàm fillIfaceSelect

// TRƯỚC:
/*
export function fillIfaceSelect(id: string, ifaces: string[]): string {
  const sel = el<HTMLSelectElement>(id);
  if (!sel) return ifaces[0] || '';
  const current = sel.value;
  const opts = ifaces.map((i) => `<option value="${esc(i)}">${esc(i)}</option>`);
  sel.innerHTML = opts.join('');
  if (current && ifaces.indexOf(current) !== -1) sel.value = current;
  return sel.value || '';
}
*/

// SAU (thêm interface ảo nếu có từ 2 interface trở lên):

const SPECIAL_WAN_TOTAL = '__wan_total__';

export function fillIfaceSelect(id: string, ifaces: string[]): string {
  const sel = el<HTMLSelectElement>(id);
  if (!sel) return ifaces[0] || '';
  const current = sel.value;
  const opts: string[] = [];

  // Thêm interface ảo nếu có nhiều interface để gộp
  if (ifaces.length >= 2) {
    opts.push(`<option value="${SPECIAL_WAN_TOTAL}">All WANs (sum)</option>`);
  }

  // Các interface thực
  opts.push(...ifaces.map((i) => `<option value="${esc(i)}">${esc(i)}</option>`));

  sel.innerHTML = opts.join('');
  
  // Giữ giá trị hiện tại nếu hợp lệ
  if (current) {
    if (current === SPECIAL_WAN_TOTAL || ifaces.indexOf(current) !== -1) {
      sel.value = current;
    }
  }
  
  return sel.value || ifaces[0] || '';
}

// LƯU Ý:
// - Interface ảo chỉ hiện khi có >= 2 interface
// - Giá trị "__wan_total__" sẽ được backend nhận diện và gộp traffic/bandwidth của các WAN uplinks
// - Backend đọc danh sách WAN từ document `wan-uplinks` (Settings → WAN → Manual mode)
