const PREFIX = 'https://';

// Tidies a link as it's typed or pasted into a field that starts with https:// filled in:
// - pasting a full link over the prefix ("https://https://github.com/x") keeps just one https://
// - typing or pasting without one ("github.com/x") gets it added
// - deleting into the prefix puts it back
export const fixUrlInput = (raw: string) => {
  let v = raw.replace(/\s+/g, '');
  if (v === '') return '';
  while (/^https?:\/\/+https?:/i.test(v)) v = v.replace(/^https?:\/\/+/i, '');
  if (PREFIX.startsWith(v.toLowerCase())) return PREFIX;
  // Mistyped protocols ("https//", "https:/", "http:x") become https://
  v = v.replace(/^https?:?\/*/i, (m) => (/^http:\/\/$/i.test(m) ? m : PREFIX));
  return /^https?:\/\//i.test(v) ? v : PREFIX + v.replace(/^\/+/, '');
};

// Empty, or just the prefilled https://
export const isBlankUrl = (v: string) => v.trim() === '' || v.trim().toLowerCase() === PREFIX;

// A real web address: http(s), and a site name with a dot and an ending (yoursite.com)
export const isValidUrl = (v: string) => {
  try {
    const url = new URL(v.trim());
    return /^https?:$/.test(url.protocol) && /^[^.\s]+(\.[^.\s]+)*\.[a-z]{2,}$/i.test(url.hostname);
  } catch {
    return false;
  }
};

export const INVALID_URL_MESSAGE = 'that link doesn’t look right yet. it needs a site name, like github.com';
