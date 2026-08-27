/**
 * Case study pages are opened from a card inside the Assignments file folder
 * in the Work section, so "Back to home" should put the reader back where they
 * left: the folder reopened, on the same card, scrolled into view.
 *
 * State lives at module scope rather than sessionStorage on purpose. It should
 * survive the Work section unmounting while a case study is on screen, but not
 * a full page reload, since a modal springing open on a cold load is jarring.
 */

const ANCHOR = '[data-exit-anchor="assignments-folder"]';
const RETRY_MS = 100;
const MAX_ATTEMPTS = 20; // ~2s

/** Which folder card was open when we navigated away. */
let lastFolderPage: string | null = null;
/** Set only by "Back to home", so other routes home do not pop the modal. */
let restoreRequested = false;

export const rememberFolderExit = (pageId: string): void => {
  lastFolderPage = pageId;
};

/** Returns true when there is a folder state for Work to restore. */
export const requestFolderReturn = (): boolean => {
  restoreRequested = lastFolderPage !== null;
  return restoreRequested;
};

export const consumeFolderReturn = (): string | null => {
  if (!restoreRequested) return null;
  restoreRequested = false;
  const pageId = lastFolderPage;
  lastFolderPage = null;
  return pageId;
};

/**
 * The Work section is lazy loaded and its images decode late, so the anchor
 * will not exist on the first frame after navigating. Poll briefly for it,
 * then run `onDone`. Falls back to the Work section if it never turns up.
 */
export const scrollToWorkFolder = (onDone?: () => void, attempt = 0): void => {
  if (typeof document === 'undefined') return;

  // The folder is rendered twice, once per layout; only one is ever laid out.
  const visible = Array.from(
    document.querySelectorAll<HTMLElement>(ANCHOR)
  ).find((el) => el.getBoundingClientRect().width > 0);

  if (visible) {
    // 'auto' rather than 'smooth' so it cancels the scroll-to-top that
    // navigation kicks off, instead of racing it.
    visible.scrollIntoView({ block: 'center', behavior: 'auto' });
    onDone?.();
    return;
  }

  if (attempt < MAX_ATTEMPTS) {
    setTimeout(() => scrollToWorkFolder(onDone, attempt + 1), RETRY_MS);
    return;
  }

  document.getElementById('work')?.scrollIntoView({ behavior: 'auto' });
  onDone?.();
};
