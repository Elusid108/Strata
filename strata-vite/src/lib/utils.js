import { COLORS } from './constants';

/**
 * Generate a random alphanumeric ID
 * @returns {string} A 9-character random ID
 */
export const generateId = () => Math.random().toString(36).substr(2, 9);

/**
 * Get the next tab color by cycling through the COLORS array
 * @param {Array} existingTabs - Array of existing tabs
 * @returns {string} The name of the next color
 */
export const getNextTabColor = (existingTabs) => {
  if (!existingTabs || existingTabs.length === 0) return COLORS[0].name;
  const lastTabColor = existingTabs[existingTabs.length - 1].color;
  const currentIndex = COLORS.findIndex(c => c.name === lastTabColor);
  const nextIndex = (currentIndex + 1) % COLORS.length;
  return COLORS[nextIndex].name;
};

/**
 * Generate a UUID using crypto.randomUUID or fallback
 * @returns {string} A UUID string
 */
export const generateUUID = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback for older browsers or insecure contexts
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Get formatted date and time strings
 * @returns {Object} Object containing date and time formatted strings
 */
export const getFormattedDate = () => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const timeOptions = { hour: 'numeric', minute: 'numeric' };
  const now = new Date();
  return {
    date: now.toLocaleDateString('en-US', options),
    time: now.toLocaleTimeString('en-US', timeOptions)
  };
};

/**
 * Pure function: resolve notebook/tab/page from data by ids
 * @param {Object} data - The full data object containing notebooks
 * @param {string} notebookId - The notebook ID
 * @param {string} tabId - The tab ID
 * @param {string} pageId - The page ID
 * @returns {Object} Object containing { notebook, tab, page }
 */
export const getActiveContext = (data, notebookId, tabId, pageId) => {
  const notebook = data.notebooks?.find(n => n.id === notebookId) ?? null;
  const tab = notebook?.tabs?.find(t => t.id === tabId) ?? null;
  const page = tab?.pages?.find(p => p.id === pageId) ?? null;
  return { notebook, tab, page };
};

/**
 * Pure function: get drop indicator Tailwind classes for block drag and drop
 * @param {string} position - The drop position ('top', 'bottom', 'left', 'right')
 * @returns {string} Tailwind CSS classes for the drop indicator
 */
export const getDropIndicatorClass = (position) => {
  switch (position) {
    case 'top': return 'border-t-4 border-blue-500 pt-2';
    case 'bottom': return 'border-b-4 border-blue-500 pb-2';
    case 'left': return 'border-l-4 border-blue-500 pl-2';
    case 'right': return 'border-r-4 border-blue-500 pr-2';
    default: return '';
  }
};

/**
 * Pure function: immutable update of a single page in data
 * @param {Object} data - The full data object
 * @param {Object} ids - Object containing { notebookId, tabId, pageId }
 * @param {Function} updater - Function that receives page and returns updated page
 * @returns {Object} New data object with the updated page
 */
export const updatePageInData = (data, { notebookId, tabId, pageId }, updater) => {
  return {
    ...data,
    notebooks: data.notebooks.map(nb =>
      nb.id !== notebookId ? nb : {
        ...nb,
        tabs: nb.tabs.map(tab =>
          tab.id !== tabId ? tab : {
            ...tab,
            pages: tab.pages.map(p =>
              p.id !== pageId ? p : updater(p)
            )
          }
        )
      }
    )
  };
};

/**
 * Extract YouTube video ID from a URL
 * @param {string} url - YouTube URL
 * @returns {string} YouTube video ID or empty string
 */
export function getYouTubeID(url) {
  if (!url) return '';
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?v=)|(shorts\/))([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[8].length === 11) ? match[8] : '';
}

/**
 * Normalize list content: ensure valid list markup
 * For ul/ol: ensures at least one li element
 * For todo: ensures each li has data-checked attribute
 * @param {string} raw - Raw HTML content
 * @param {string} listType - Type of list ('ul', 'ol', or 'todo')
 * @returns {string} Normalized HTML string
 */
export const normalizeListContent = (raw, listType) => {
  if (!raw || raw.trim() === '' || raw === '<br>') {
    return listType === 'todo' ? '<li data-checked="false"></li>' : '<li></li>';
  }
  if (listType === 'todo') {
    const div = document.createElement('div');
    div.innerHTML = raw;
    const lis = div.querySelectorAll('li');
    lis.forEach(li => {
      if (!li.hasAttribute('data-checked')) li.setAttribute('data-checked', 'false');
    });
    return div.innerHTML || '<li data-checked="false"></li>';
  }
  if (!raw.includes('<li>')) return `<li>${raw}</li>`;
  return raw;
};
