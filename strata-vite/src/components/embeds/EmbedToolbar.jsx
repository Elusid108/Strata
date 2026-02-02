import { useState } from 'react';
import { Star, Edit3, Eye, ZoomIn, ZoomOut, ExternalLink } from '../icons';
import { shouldShowEditToggle, shouldShowZoomControls, getTypeDisplayName } from '../../lib/embed-utils';
import { DRIVE_SERVICE_ICONS } from '../../lib/constants';

/**
 * Toolbar for embed pages with controls for view mode, zoom, and edit URL
 */
export function EmbedToolbar({
  page,
  viewMode,
  onViewModeChange,
  zoomLevel,
  onZoomChange,
  onEditUrl,
  onToggleStar,
  isStarred
}) {
  const showEditToggle = shouldShowEditToggle(page?.type);
  const showZoom = shouldShowZoomControls(page, viewMode);
  
  // Get service icon URL
  const serviceIcon = DRIVE_SERVICE_ICONS.find(s => s.type === page?.type);
  const typeName = getTypeDisplayName(page?.type);
  
  const zoomLevels = [50, 75, 100, 125, 150, 175, 200];
  
  const handleZoomIn = () => {
    const currentIndex = zoomLevels.indexOf(zoomLevel);
    if (currentIndex < zoomLevels.length - 1) {
      onZoomChange(zoomLevels[currentIndex + 1]);
    }
  };
  
  const handleZoomOut = () => {
    const currentIndex = zoomLevels.indexOf(zoomLevel);
    if (currentIndex > 0) {
      onZoomChange(zoomLevels[currentIndex - 1]);
    }
  };

  return (
    <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800">
      {/* Left: Icon, Title, Type */}
      <div className="flex items-center gap-3">
        {serviceIcon?.url ? (
          <img src={serviceIcon.url} alt={typeName} className="w-6 h-6" />
        ) : (
          <span className="text-2xl">{page?.icon || '📄'}</span>
        )}
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold dark:text-white">{page?.name || 'Untitled'}</h1>
          <span className="text-xs text-gray-500 dark:text-gray-400">{typeName}</span>
        </div>
        
        {/* Star button */}
        <button
          onClick={onToggleStar}
          className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
            isStarred ? 'text-yellow-500' : 'text-gray-400'
          }`}
          title={isStarred ? 'Unstar' : 'Star'}
        >
          <Star size={18} fill={isStarred ? 'currentColor' : 'none'} />
        </button>
      </div>
      
      {/* Right: Controls */}
      <div className="flex items-center gap-2">
        {/* Edit/Preview Toggle */}
        {showEditToggle && (
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
            <button
              onClick={() => onViewModeChange('edit')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1.5 ${
                viewMode === 'edit'
                  ? 'bg-white dark:bg-gray-600 shadow text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Edit3 size={14} />
              Edit
            </button>
            <button
              onClick={() => onViewModeChange('preview')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1.5 ${
                viewMode === 'preview'
                  ? 'bg-white dark:bg-gray-600 shadow text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Eye size={14} />
              Preview
            </button>
          </div>
        )}
        
        {/* Zoom Controls */}
        {showZoom && (
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 50}
              className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400"
              title="Zoom out"
            >
              <ZoomOut size={16} />
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[48px] text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 200}
              className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400"
              title="Zoom in"
            >
              <ZoomIn size={16} />
            </button>
          </div>
        )}
        
        {/* Open in new tab */}
        {page?.embedUrl && (
          <a
            href={page.webViewLink || page.embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            title="Open in new tab"
          >
            <ExternalLink size={16} />
          </a>
        )}
        
        {/* Edit URL button */}
        <button
          onClick={onEditUrl}
          className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 flex items-center gap-1.5"
        >
          <Edit3 size={14} />
          Edit URL
        </button>
      </div>
    </div>
  );
}
