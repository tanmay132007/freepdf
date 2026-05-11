
/**
 * Helper to manage document title and meta descriptions in a React SPA.
 * In a real production app, you'd use react-helmet-async for SSR-friendly meta tags.
 */
export function setMetadata(title: string, description: string) {
  document.title = `${title} — SavePDF`;
  
  // Update meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute('content', description);

  // Update OG tags (simplified)
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', `${title} — SavePDF`);
  
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) ogDescription.setAttribute('content', description);
}
