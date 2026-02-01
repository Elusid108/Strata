// ToolbarBtn - Reusable toolbar button component
// Extracted from Strata index.html (lines 2522-2530)

const ToolbarBtn = ({ icon, onClick, active, title }) => (
  <button 
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className={`p-1 rounded-md transition-colors ${active ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100 text-gray-700'}`}
    title={title}
  >
    {icon}
  </button>
);

export default ToolbarBtn;
