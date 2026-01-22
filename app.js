  const { useState, useEffect, useRef } = React;

  // --- Internal Icon Components ---
  const IconBase = ({ children, size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {children}
    </svg>
  );

  const Plus = (props) => <IconBase {...props}><path d="M5 12h14"/><path d="M12 5v14"/></IconBase>;
  const Trash2 = (props) => <IconBase {...props}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></IconBase>;
  const GripVertical = (props) => <IconBase {...props}><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></IconBase>;
  const ImageIcon = (props) => <IconBase {...props}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></IconBase>;
  const Youtube = (props) => <IconBase {...props}><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></IconBase>;
  const Type = (props) => <IconBase {...props}><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/></IconBase>;
  const LinkIcon = (props) => <IconBase {...props}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></IconBase>;
  const ChevronRight = (props) => <IconBase {...props}><path d="m9 18 6-6-6-6"/></IconBase>;
  const Book = (props) => <IconBase {...props}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></IconBase>;
  const Settings = (props) => <IconBase {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></IconBase>;
  const X = (props) => <IconBase {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></IconBase>;
  const Minus = (props) => <IconBase {...props}><path d="M5 12h14"/></IconBase>;
  const AlertCircle = (props) => <IconBase {...props}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></IconBase>;
  const ZoomIn = (props) => <IconBase {...props}><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="11" x2="11" y1="8" y2="14"/><line x1="8" x2="14" y1="11" y2="11"/></IconBase>;
  const ZoomOut = (props) => <IconBase {...props}><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="8" x2="14" y1="11" y2="11"/></IconBase>;
  const MoreVertical = (props) => <IconBase {...props}><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></IconBase>;
  const List = (props) => <IconBase {...props}><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></IconBase>;
  const ListOrdered = (props) => <IconBase {...props}><line x1="10" x2="21" y1="6" y2="6"/><line x1="10" x2="21" y1="12" y2="12"/><line x1="10" x2="21" y1="18" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></IconBase>;
  const Heading1 = (props) => <IconBase {...props}><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="m17 12 3-2v8"/></IconBase>;
  const Heading2 = (props) => <IconBase {...props}><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1"/></IconBase>;
  const Heading3 = (props) => <IconBase {...props}><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2"/><path d="M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2"/></IconBase>;
  const Heading4 = (props) => <IconBase {...props}><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17 10v4h4"/><path d="M21 10v8"/></IconBase>;
  const AlignLeft = (props) => <IconBase {...props}><line x1="17" x2="3" y1="6" y2="6"/><line x1="21" x2="3" y1="12" y2="12"/><line x1="17" x2="3" y1="18" y2="18"/></IconBase>;
  const Bold = (props) => <IconBase {...props}><path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/></IconBase>;
  const Italic = (props) => <IconBase {...props}><line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/></IconBase>;
  const Underline = (props) => <IconBase {...props}><path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" x2="20" y1="20" y2="20"/></IconBase>;
  const CheckSquare = (props) => <IconBase {...props}><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></IconBase>;
  const Image = (props) => <IconBase {...props}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></IconBase>;
  const Moon = (props) => <IconBase {...props}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></IconBase>;
  const GoogleG = ({ size = 16, className = "" }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
  const Sun = (props) => <IconBase {...props}><circle cx="12" cy="12" r="5"/><line x1="12" x2="12" y1="1" y2="3"/><line x1="12" x2="12" y1="21" y2="23"/><line x1="4.22" x2="5.64" y1="4.22" y2="5.64"/><line x1="18.36" x2="19.78" y1="18.36" y2="19.78"/><line x1="1" x2="3" y1="12" y2="12"/><line x1="21" x2="23" y1="12" y2="12"/><line x1="4.22" x2="5.64" y1="19.78" y2="18.36"/><line x1="18.36" x2="19.78" y1="5.64" y2="4.22"/></IconBase>;
  const Monitor = (props) => <IconBase {...props}><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></IconBase>;
  const Columns = (props) => <IconBase {...props}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" x2="12" y1="3" y2="21"/></IconBase>;
  const Minimize2 = (props) => <IconBase {...props}><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" x2="21" y1="10" y2="3"/><line x1="3" x2="10" y1="21" y2="14"/></IconBase>;
  const Maximize2 = (props) => <IconBase {...props}><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" x2="14" y1="3" y2="10"/><line x1="3" x2="10" y1="21" y2="14"/></IconBase>;
  const Star = ({ size = 24, className = "", filled = false, ...props }) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
  const Edit3 = (props) => <IconBase {...props}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></IconBase>;

  // --- Constants & Utilities ---
  const COLORS = [
    { name: 'gray', label: 'Gray' }, { name: 'red', label: 'Red' }, { name: 'orange', label: 'Orange' },
    { name: 'amber', label: 'Amber' }, { name: 'green', label: 'Green' }, { name: 'teal', label: 'Teal' },
    { name: 'blue', label: 'Blue' }, { name: 'indigo', label: 'Indigo' }, { name: 'purple', label: 'Purple' },
    { name: 'pink', label: 'Pink' },
  ];

  const SLASH_COMMANDS = [
    { cmd: 'h1', aliases: ['h1', 'header1', 'heading1'], label: 'Heading 1', desc: 'Large section heading', type: 'h1' },
    { cmd: 'h2', aliases: ['h2', 'header2', 'heading2'], label: 'Heading 2', desc: 'Medium section heading', type: 'h2' },
    { cmd: 'h3', aliases: ['h3', 'header3', 'heading3'], label: 'Heading 3', desc: 'Small section heading', type: 'h3' },
    { cmd: 'h4', aliases: ['h4', 'header4', 'heading4'], label: 'Heading 4', desc: 'Tiny section heading', type: 'h4' },
    { cmd: 'ul', aliases: ['ul', 'list', 'bullet', 'bullets'], label: 'Bullet List', desc: 'Unordered list', type: 'ul' },
    { cmd: 'ol', aliases: ['ol', 'num', 'ordered', 'numbered'], label: 'Numbered List', desc: 'Ordered list', type: 'ol' },
    { cmd: 'todo', aliases: ['todo', 'check', 'task', 'checkbox'], label: 'To-do', desc: 'Checkbox item', type: 'todo' },
    { cmd: 'img', aliases: ['img', 'image', 'pic', 'picture'], label: 'Image', desc: 'Embed an image', type: 'image' },
    { cmd: 'vid', aliases: ['vid', 'video', 'youtube'], label: 'Video', desc: 'Embed YouTube video', type: 'video' },
    { cmd: 'link', aliases: ['link', 'url', 'bookmark'], label: 'Link', desc: 'Web bookmark', type: 'link' },
    { cmd: 'div', aliases: ['div', 'divider', 'hr', 'line'], label: 'Divider', desc: 'Horizontal line', type: 'divider' },
  ];

  const BG_COLORS = {
      gray: 'bg-gray-100', red: 'bg-red-100', orange: 'bg-orange-100', amber: 'bg-amber-100',
      green: 'bg-green-100', teal: 'bg-teal-100', blue: 'bg-blue-100', indigo: 'bg-indigo-100',
      purple: 'bg-purple-100', pink: 'bg-pink-100',
  };

  const EMOJIS = ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👹", "👺", "🤡", "💩", "👻", "💀", "☠️", "👽", "👾", "🤖", "🎃", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "👋", "🤚", "🖐", "✋", "🖖", "👌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✍️", "💅", "🤳", "💪", "🦾", "🦵", "🦶", "👂", "🦻", "👃", "🧠", "🦷", "🦴", "👀", "👁", "👅", "👄", "👶", "🧒", "👦", "👧", "🧑", "👱", "👨", "🧔", "👨‍🦰", "👨‍🦱", "👨‍🦳", "👨‍🦲", "👩", "👩‍🦰", "👩‍🦱", "👩‍🦳", "👩‍🦲", "👱‍♀️", "👱‍♂️", "🧓", "👴", "👵", "🙍", "🙍‍♂️", "🙍‍♀️", "🙎", "🙎‍♂️", "🙎‍♀️", "🙅", "🙅‍♂️", "🙅‍♀️", "🙆", "🙆‍♂️", "🙆‍♀️", "💁", "💁‍♂️", "💁‍♀️", "🙋", "🙋‍♂️", "🙋‍♀️", "🧏", "🧏‍♂️", "🧏‍♀️", "🙇", "🙇‍♂️", "🙇‍♀️", "🤦", "🤦‍♂️", "🤦‍♀️", "🤷", "🤷‍♂️", "🤷‍♀️", "🧑‍⚕️", "👨‍⚕️", "👩‍⚕️", "🧑‍🎓", "👨‍🎓", "👩‍🎓", "🧑‍🏫", "👨‍🏫", "👩‍🏫", "🧑‍⚖️", "👨‍⚖️", "👩‍⚖️", "🧑‍🌾", "👨‍🌾", "👩‍🌾", "🧑‍🍳", "👨‍🍳", "👩‍🍳", "🧑‍🔧", "👨‍🔧", "👩‍🔧", "🧑‍🏭", "👨‍🏭", "👩‍🏭", "🧑‍💼", "👨‍💼", "👩‍💼", "🧑‍🔬", "👨‍🔬", "👩‍🔬", "🧑‍💻", "👨‍💻", "👩‍💻", "🧑‍🎤", "👨‍🎤", "👩‍🎤", "🧑‍🎨", "👨‍🎨", "👩‍🎨", "🧑‍✈️", "👨‍✈️", "👩‍✈️", "🧑‍🚀", "👨‍🚀", "👩‍🚀", "🧑‍🚒", "👨‍🚒", "👩‍🚒", "👮", "👮‍♂️", "👮‍♀️", "🕵", "🕵‍♂️", "🕵‍♀️", "💂", "💂‍♂️", "💂‍♀️", "👷", "👷‍♂️", "👷‍♀️", "🤴", "👸", "👳", "👳‍♂️", "👳‍♀️", "👲", "🧕", "🤵", "🤵‍♂️", "🤵‍♀️", "👰", "👰‍♂️", "👰‍♀️", "🤰", "🤱", "👩‍🍼", "👨‍🍼", "🧑‍🍼", "👼", "🎅", "🤶", "🧑‍🎄", "🦸", "🦸‍♂️", "🦸‍♀️", "🦹", "🦹‍♂️", "🦹‍♀️", "🧙", "🧙‍♂️", "🧙‍♀️", "🧚", "🧚‍♂️", "🧚‍♀️", "🧛", "🧛‍♂️", "🧛‍♀️", "🧜", "🧜‍♂️", "🧜‍♀️", "🧝", "🧝‍♂️", "🧝‍♀️", "🧞", "🧞‍♂️", "🧞‍♀️", "🧟", "🧟‍♂️", "🧟‍♀️", "💆", "💆‍♂️", "💆‍♀️", "💇", "💇‍♂️", "💇‍♀️", "🚶", "🚶‍♂️", "🚶‍♀️", "🧍", "🧍‍♂️", "🧍‍♀️", "🧎", "🧎‍♂️", "🧎‍♀️", "🧑‍🦯", "👨‍🦯", "👩‍🦯", "🧑‍🦼", "👨‍🦼", "👩‍🦼", "🧑‍🦽", "👨‍🦽", "👩‍🦽", "🏃", "🏃‍♂️", "🏃‍♀️", "💃", "🕺", "🕴", "👯", "👯‍♂️", "👯‍♀️", "🧖", "🧖‍♂️", "🧖‍♀️", "🧗", "🧗‍♂️", "🧗‍♀️", "🤺", "🏇", "⛷", "🏂", "🏌", "🏌‍♂️", "🏌‍♀️", "🏄", "🏄‍♂️", "🏄‍♀️", "🚣", "🚣‍♂️", "🚣‍♀️", "🏊", "🏊‍♂️", "🏊‍♀️", "⛹", "⛹‍♂️", "⛹‍♀️", "🏋", "🏋‍♂️", "🏋‍♀️", "🚴", "🚴‍♂️", "🚴‍♀️", "🚵", "🚵‍♂️", "🚵‍♀️", "🤸", "🤸‍♂️", "🤸‍♀️", "🤼", "🤼‍♂️", "🤼‍♀️", "🤽", "🤽‍♂️", "🤽‍♀️", "🤾", "🤾‍♂️", "🤾‍♀️", "🤹", "🤹‍♂️", "🤹‍♀️", "🧘", "🧘‍♂️", "🧘‍♀️", "🛀", "🛌", "📄", "📁", "📂", "💼", "📝", "🗓", "📅", "📇", "📉", "📈", "📊", "📋", "📌", "📍", "📎", "📏", "📐", "✂️", "🗂", "🗃", "🗄", "🗑", "🔒", "🔓", "🔏", "🔐", "🔑", "🗝", "🔨", "🪓", "⛏", "🔧", "🔩", "🧱", "⚙️", "🗜", "⚖️", "🔗", "⛓", "🧰", "🧲", "🪜", "🩸", "💉", "💊", "🩹", "🩺", "🔭", "🔬", "🦠", "🧬", "🧪", "🧫", "🧹", "🧺", "🧻", "🚽", "🚰", "🚿", "🛁", "🧼", "🪥", "🪒", "🧽", "🪣", "🧴", "🪞", "🪟", "🛏", "🛋", "🪑", "🚪", "🛎", "🖼", "🧭", "🗺", "⛱", "🗿", "🛍", "🛒", "👓", "🕶", "🥽", "🥼", "🦺", "👔", "👕", "👖", "🧣", "🧤", "🧥", "🧦", "👗", "👘", "🥻", "🩱", "🩲", "🩳", "👙", "👚", "👛", "👜", "👝", "🎒", "🎒", "👞", "👟", "🥾", "🥿", "👠", "👡", "🩰", "👢", "👑", "👒", "🎩", "🎓", "🧢", "⛑", "🪖", "💄", "💍", "💎", "🔇", "🔈", "🔉", "🔊", "📢", "📣", "📯", "🔔", "🔕", "🎼", "🎵", "🎶", "🎙", "🎚", "🎛", "🎤", "🎧", "📻", "🎷", "🪗", "🎸", "🎹", "🎺", "🎻", "🪕", "🥁", "🥁", "📱", "📲", "☎️", "📞", "📟", "📠", "🔋", "🔌", "💻", "🖥", "🖨", "⌨️", "🖱", "🖲", "💽", "💾", "💿", "📀", "🧮", "🎥", "🎞", "📽", "🎬", "📺", "📷", "📸", "📹", "📼", "🔍", "🔎", "🕯", "💡", "🔦", "🏮", "🪔", "📔", "📕", "📖", "📗", "📘", "📙", "📚", "📓", "📒", "📃", "📜", "📄", "📰", "🗞", "📑", "🔖", "🏷", "💰", "🪙", "💴", "💵", "💶", "💷", "💸", "💳", "🧾", "✉️", "✉️", "📧", "📨", "📩", "📤", "📥", "📦", "📫", "📪", "📬", "📭", "📮", "🗳", "✏️", "✒️", "🖋", "🖊", "🖌", "🖍", "📝", "💼", "📁", "📂", "🗂", "📅", "📆", "🗒", "🗓", "📇", "📈", "📉", "📊", "📋", "📌", "📍", "📎", "🖇", "📏", "📐", "✂️", "🗃", "🗄", "🗑", "🔒", "🔓", "🔏", "🔐", "🔑", "🗝", "🔨", "🪓", "⛏", "🔧", "🔩", "🧱", "⚙️", "🗜", "⚖️", "🔗", "⛓", "🧰", "🧲", "🪜", "⚗️", "🔭", "🔬", "🕳", "🩹", "🩺", "💊", "💉", "🩸", "🧬", "🦠", "🧫", "🧪", "🌡", "🧹", "🪠", "🧺", "🧻", "🚽", "🚰", "🚿", "🛁", "🛀", "🧼", "🪥", "🪒", "🧽", "🪣", "🧴", "🛎", "🔑", "🗝", "🚪", "🪑", "🛋", "🛏", "🛌", "🧸", "🪆", "🖼", "🪞", "🪟", "🛍", "🛒", "🎁", "🎈", "🎏", "🎀", "🪄", "🪅", "🎊", "🎉", "🎎", "🏮", "🎐", "🧧", "✉️", "📩", "📨", "📧", "💌", "📥", "📤", "📦", "🏷", "🪧", "📪", "📫", "📬", "📭", "📮", "📯", "📜", "📃", "📄", "📑", "🧾", "📊", "📈", "📉", "🗒", "🗓", "📆", "📅", "🗑", "📇", "🗃", "🗳", "🗄", "📋", "📁", "📂", "🗂", "🗞", "📰", "📓", "📔", "📒", "📕", "📗", "📘", "📙", "📚", "📖", "🔖", "🔗", "📎", "🖇", "📐", "📏", "🧮", "📌", "📍", "✂️", "🖊", "🖋", "✒️", "🖌", "🖍", "📝", "✏️", "🔍", "🔎", "🔏", "🔐", "🔒", "🔓"];

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const INITIAL_DATA = {
    notebooks: [
      {
        id: 'nb1', name: 'My First Notebook', icon: '📓', activeTabId: 'tab1',
        tabs: [
          {
            id: 'tab1', name: 'General', icon: '📋', color: 'blue', activePageId: 'page1',
            pages: [
              {
                id: 'page1', 
                name: 'Welcome', 
                createdAt: Date.now(),
                icon: '👋',
                cover: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
                rows: [
                  {
                    id: 'row1', columns: [
                      {
                        id: 'col1', blocks: [
                          { id: 'blk1', type: 'h1', content: 'Welcome to your new Note App!' },
                          { id: 'blk2', type: 'text', content: 'Try <b>bolding</b> or <i>italicizing</i> this text using standard keyboard shortcuts.' },
                          { id: 'blk3', type: 'text', content: 'Type / to see available commands like /h1, /todo, /img, etc.' },
                          { id: 'blk4', type: 'todo', content: 'Try checking this item', checked: false }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };

  function getYouTubeID(url) {
      if (!url) return '';
      const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?v=)|(shorts\/))([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[8].length === 11) ? match[8] : '';
  }

  // --- Components ---

  const ImageLightbox = ({ src, onClose }) => {
      const [scale, setScale] = useState(1);
      return (
          <div className="fixed inset-0 z-[10001] bg-black/95 flex flex-col animate-fade-in backdrop-blur-sm">
              <div className="flex justify-end p-6">
                  <button onClick={onClose} className="text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full"><X size={24} /></button>
              </div>
              <div className="flex-1 flex items-center justify-center overflow-hidden p-8" onClick={onClose}>
                  <img src={src} alt="Full screen" className="max-w-full max-h-full object-contain transition-transform duration-300 ease-in-out"
                      style={{ transform: `scale(${scale})`, cursor: scale > 1 ? 'zoom-out' : 'zoom-in' }}
                      onClick={(e) => { e.stopPropagation(); setScale(prev => prev === 1 ? 2.5 : 1); }} />
              </div>
          </div>
      )
  }

  const ContentBlock = ({ html, tagName, className, placeholder, onChange, onInsertBelow, onInsertTextBelow, onExitList, blockId, autoFocusId, onFocus, onConvert }) => {
      const contentEditableRef = useRef(null);
      const isLocked = useRef(false); 
      const initialHtml = useRef(html);
      const [slashMenu, setSlashMenu] = useState({ open: false, filter: '', selectedIndex: 0, position: { top: 0, left: 0 } });

      const processHtml = (rawHtml, tag) => {
          if ((tag === 'ul' || tag === 'ol')) {
              if (!rawHtml || rawHtml.trim() === '' || rawHtml === '<br>') return '<li></li>';
              if (!rawHtml.includes('<li>')) return `<li>${rawHtml}</li>`;
          }
          return rawHtml;
      };

      const safeHtml = processHtml(html, tagName);
      initialHtml.current = processHtml(initialHtml.current, tagName);

      // Filter slash commands based on input
      const filteredCommands = slashMenu.open ? SLASH_COMMANDS.filter(cmd => 
          cmd.aliases.some(alias => alias.startsWith(slashMenu.filter.toLowerCase())) ||
          cmd.label.toLowerCase().includes(slashMenu.filter.toLowerCase())
      ) : [];

      useEffect(() => {
          if (contentEditableRef.current && !isLocked.current) {
               if (contentEditableRef.current.innerHTML !== safeHtml) {
                   contentEditableRef.current.innerHTML = safeHtml;
               }
          }
      }, [safeHtml]);

      useEffect(() => {
          if (autoFocusId === blockId && contentEditableRef.current) {
              contentEditableRef.current.focus();
              const range = document.createRange();
              const sel = window.getSelection();
              range.selectNodeContents(contentEditableRef.current);
              range.collapse(false);
              sel.removeAllRanges();
              sel.addRange(range);
          }
      }, [autoFocusId, blockId]);

      const getCaretPosition = () => {
          const sel = window.getSelection();
          if (sel.rangeCount > 0) {
              const range = sel.getRangeAt(0).cloneRange();
              range.collapse(true);
              const rect = range.getClientRects()[0];
              if (rect) return { top: rect.bottom + 5, left: rect.left };
          }
          if (contentEditableRef.current) {
              const rect = contentEditableRef.current.getBoundingClientRect();
              return { top: rect.bottom + 5, left: rect.left };
          }
          return { top: 0, left: 0 };
      };

      const selectSlashCommand = (cmd) => {
          setSlashMenu({ open: false, filter: '', selectedIndex: 0, position: { top: 0, left: 0 } });
          onConvert(cmd.type);
      };

      const handleInput = (e) => {
          isLocked.current = true;
          const text = e.currentTarget.innerText;
          onChange(e.currentTarget.innerHTML);
          
          // Check for slash command trigger
          if (text.startsWith('/')) {
              const filter = text.substring(1);
              const position = getCaretPosition();
              setSlashMenu({ open: true, filter, selectedIndex: 0, position });
          } else {
              if (slashMenu.open) setSlashMenu({ open: false, filter: '', selectedIndex: 0, position: { top: 0, left: 0 } });
          }
      };
      
      const handleBlur = () => { 
          isLocked.current = false;
          // Delay closing to allow click on menu items
          setTimeout(() => setSlashMenu(prev => ({ ...prev, open: false })), 150);
      };
      const handleFocus = () => { if (onFocus) onFocus(); }

      const handleKeyDown = (e) => {
          // Handle slash menu navigation
          if (slashMenu.open && filteredCommands.length > 0) {
              if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setSlashMenu(prev => ({ ...prev, selectedIndex: (prev.selectedIndex + 1) % filteredCommands.length }));
                  return;
              }
              if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setSlashMenu(prev => ({ ...prev, selectedIndex: prev.selectedIndex === 0 ? filteredCommands.length - 1 : prev.selectedIndex - 1 }));
                  return;
              }
              if (e.key === 'Enter' || e.key === 'Tab') {
                  e.preventDefault();
                  selectSlashCommand(filteredCommands[slashMenu.selectedIndex]);
                  return;
              }
              if (e.key === 'Escape') {
                  e.preventDefault();
                  setSlashMenu({ open: false, filter: '', selectedIndex: 0, position: { top: 0, left: 0 } });
                  return;
              }
          }

          if (e.key === 'Enter') {
              // Slash commands (fallback for when menu is closed but text starts with /)
              if (contentEditableRef.current) {
                  const text = contentEditableRef.current.innerText.trim();
                  if (text.startsWith('/')) {
                      const cmd = text.substring(1).toLowerCase();
                      const matchedCmd = SLASH_COMMANDS.find(c => c.aliases.includes(cmd));
                      if (matchedCmd) {
                          e.preventDefault();
                          onConvert(matchedCmd.type);
                          return;
                      }
                  }
              }

              // Standard behavior for text blocks and lists
              if (!e.shiftKey) {
                 if (tagName !== 'ul' && tagName !== 'ol') {
                     // For regular text blocks, Enter creates a new block below
                     // But if we have onExitList and content is empty, exit the list instead
                     if (onExitList && contentEditableRef.current) {
                         const text = contentEditableRef.current.innerText.trim();
                         if (text === '') {
                             e.preventDefault();
                             onExitList();
                             return;
                         }
                     }
                     e.preventDefault();
                     onInsertBelow();
                     return;
                 }
                 // For ul/ol lists, check if we should exit the list (double-enter on blank last item)
                 if (tagName === 'ul' || tagName === 'ol') {
                     const selection = window.getSelection();
                     if (selection.rangeCount > 0) {
                         // Find the current li element
                         let currentNode = selection.anchorNode;
                         let currentLi = null;
                         while (currentNode && currentNode !== contentEditableRef.current) {
                             if (currentNode.nodeName === 'LI') {
                                 currentLi = currentNode;
                                 break;
                             }
                             currentNode = currentNode.parentNode;
                         }
                         
                         if (currentLi) {
                             const liText = currentLi.innerText.trim();
                             const allLis = contentEditableRef.current.querySelectorAll('li');
                             const isLastLi = allLis.length > 0 && allLis[allLis.length - 1] === currentLi;
                             
                             // If current li is blank and is the last one, exit the list
                             if (liText === '' && isLastLi) {
                                 e.preventDefault();
                                 // Remove the blank li
                                 currentLi.remove();
                                 // Update the content
                                 onChange(contentEditableRef.current.innerHTML);
                                 // Create a new text block below
                                 onInsertBelow();
                                 return;
                             }
                         }
                     }
                 }
              }
          }

          if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
              e.preventDefault();
              // Use onInsertTextBelow if available (for todo blocks), otherwise onInsertBelow
              if (onInsertTextBelow) {
                  onInsertTextBelow();
              } else {
                  onInsertBelow();
              }
              return;
          }
          if (e.key === 'Tab') {
              e.preventDefault();
              if (tagName === 'ul' || tagName === 'ol') document.execCommand(e.shiftKey ? 'outdent' : 'indent', false, null);
          }
          if ((e.ctrlKey || e.metaKey)) {
              switch(e.key.toLowerCase()) {
                  case 'b': e.preventDefault(); document.execCommand('bold', false, null); break;
                  case 'i': e.preventDefault(); document.execCommand('italic', false, null); break;
                  case 'u': e.preventDefault(); document.execCommand('underline', false, null); break;
                  default: break;
              }
          }
      };

      const Tag = tagName;
      return (
          <>
              <Tag
                  ref={contentEditableRef}
                  className={tagName === 'ul' || tagName === 'ol' ? 
                      `outline-none pl-5 ml-1 cursor-text list-outside ${className} ${tagName === 'ul' ? 'list-disc' : 'list-decimal'}` : 
                      `outline-none empty:before:content-[attr(placeholder)] empty:before:text-gray-300 cursor-text ${className}`
                  }
                  contentEditable
                  suppressContentEditableWarning
                  placeholder={placeholder}
                  onInput={handleInput}
                  onKeyDown={handleKeyDown}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                  dangerouslySetInnerHTML={{ __html: initialHtml.current }}
              />
              {slashMenu.open && filteredCommands.length > 0 && (
                  <div 
                      className="fixed z-[10000] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl py-1 min-w-[220px] max-h-[300px] overflow-y-auto animate-fade-in"
                      style={{ top: slashMenu.position.top, left: slashMenu.position.left }}
                  >
                      {filteredCommands.map((cmd, index) => (
                          <div
                              key={cmd.cmd}
                              className={`px-3 py-2 cursor-pointer flex items-center gap-3 ${index === slashMenu.selectedIndex ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                              onMouseDown={(e) => { e.preventDefault(); selectSlashCommand(cmd); }}
                              onMouseEnter={() => setSlashMenu(prev => ({ ...prev, selectedIndex: index }))}
                          >
                              <span className="text-gray-400 font-mono text-sm">/{cmd.cmd}</span>
                              <div className="flex-1">
                                  <div className="font-medium text-sm dark:text-white">{cmd.label}</div>
                                  <div className="text-xs text-gray-400">{cmd.desc}</div>
                              </div>
                          </div>
                      ))}
                  </div>
              )}
          </>
      );
  };

  const BlockComponent = ({ block, rowId, colId, onUpdate, onDelete, onInsertBelow, autoFocusId, onRequestFocus, onDragStart, onDragOver, onDrop, dropTarget, isSelected, onHandleClick, onFocus }) => {
      const isTarget = dropTarget && dropTarget.blockId === block.id;
      const indicatorStyle = isTarget ? (() => {
          switch(dropTarget.position) {
              case 'top': return 'border-t-4 border-blue-500 pt-2';
              case 'bottom': return 'border-b-4 border-blue-500 pb-2';
              case 'left': return 'border-l-4 border-blue-500 pl-2';
              case 'right': return 'border-r-4 border-blue-500 pr-2';
              default: return '';
          }
      })() : '';

      const [showLightbox, setShowLightbox] = useState(false);
      const bgClass = block.backgroundColor ? BG_COLORS[block.backgroundColor] : '';
      // Only add bg-blue-50/50 if there's no background color, so selection doesn't obscure block colors
      const borderClass = isSelected 
          ? `ring-2 ring-blue-400 ring-offset-2 ${!block.backgroundColor ? 'bg-blue-50/50' : ''}` 
          : 'hover:bg-gray-50';

      const handleConvert = (newType) => {
          const isMedia = ['image', 'video', 'link'].includes(newType);
          onUpdate({ type: newType, content: isMedia ? '' : '', url: '' });
          // For dividers, auto-insert a text block below for continued typing
          if (newType === 'divider') {
              onInsertBelow();
          } else if (onRequestFocus) {
              // Focus the block after conversion so user can start typing immediately
              onRequestFocus();
          }
      };
      
      const handleMediaKeyDown = (e) => {
          if (e.key === 'Enter') {
              if (e.ctrlKey || e.metaKey) {
                  // Ctrl+Enter -> New block below
                  e.preventDefault();
                  onInsertBelow();
              } else {
                  // Enter -> Confirm input (blur)
                  e.target.blur();
              }
          }
      };

      const renderTextContent = () => {
          const props = {
              html: block.content,
              onChange: (content) => onUpdate({ content }),
              onInsertBelow, blockId: block.id, autoFocusId, onFocus,
              onConvert: handleConvert,
              placeholder: "Type '/' for commands"
          };

          switch (block.type) {
              case 'h1': return <ContentBlock tagName="h1" className="text-3xl font-bold mb-4" {...props} placeholder="Heading 1" />;
              case 'h2': return <ContentBlock tagName="h2" className="text-2xl font-bold mb-3 border-b border-gray-100 pb-1" {...props} placeholder="Heading 2" />;
              case 'h3': return <ContentBlock tagName="h3" className="text-xl font-bold mb-2" {...props} placeholder="Heading 3" />;
              case 'h4': return <ContentBlock tagName="h4" className="text-lg font-semibold mb-2 text-gray-600" {...props} placeholder="Heading 4" />;
              case 'ul': return <ContentBlock tagName="ul" className="mb-2" {...props} />;
              case 'ol': return <ContentBlock tagName="ol" className="mb-2" {...props} />;
              default: return <ContentBlock tagName="div" className="leading-relaxed min-h-[1.5em]" {...props} />;
          }
      };

      return (
          <>
              <div 
                  draggable onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop}
                  className={`group relative flex gap-2 items-start p-1 rounded transition-all ${indicatorStyle} ${bgClass} ${borderClass}`}
              >
                  <div className="mt-1 cursor-grab opacity-0 group-hover:opacity-50 hover:!opacity-100 active:cursor-grabbing text-gray-400 block-handle" onClick={onHandleClick}>
                      <GripVertical size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                      {['text', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol'].includes(block.type) && renderTextContent()}
                      
                      {block.type === 'todo' && (
                          <div className="flex items-start gap-2 mb-1">
                              <div className="pt-1 select-none" contentEditable={false}>
                                  <input type="checkbox" checked={block.checked || false} onChange={(e) => onUpdate({ checked: e.target.checked })} className="w-4 h-4 cursor-pointer accent-blue-500 rounded border-gray-300" />
                              </div>
                              <div className={`flex-1 ${block.checked ? 'line-through text-gray-400' : ''}`}>
                                  <ContentBlock tagName="div" className="leading-relaxed min-h-[1.5em]" html={block.content} onChange={(content) => onUpdate({ content })} onInsertBelow={() => onInsertBelow('todo')} onInsertTextBelow={() => onInsertBelow('text')} onExitList={() => handleConvert('text')} blockId={block.id} autoFocusId={autoFocusId} onFocus={onFocus} onConvert={handleConvert} placeholder="To-do item" />
                              </div>
                          </div>
                      )}

                      {block.type === 'image' && (
                          <div className="space-y-2">
                              {block.url ? (
                                  <div className="group/image relative">
                                      <img src={block.url} alt="Content" className="max-w-full rounded shadow-sm max-h-[400px] object-cover hover:scale-[1.02] cursor-zoom-in transition-transform" onClick={() => setShowLightbox(true)} />
                                  </div>
                              ) : (
                                  <div className="bg-gray-100 p-4 rounded text-center border-2 border-dashed border-gray-300">
                                      <input className="w-full p-2 border rounded text-xs mb-2" placeholder="Paste image URL..." onBlur={(e) => onUpdate({ url: e.target.value })} onKeyDown={handleMediaKeyDown} autoFocus/>
                                  </div>
                              )}
                          </div>
                      )}
                      {block.type === 'video' && (
                          <div className="space-y-2">
                              {block.url ? (
                                  <div className="aspect-video w-full rounded overflow-hidden shadow-sm bg-black">
                                      <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${getYouTubeID(block.url)}`} frameBorder="0" allowFullScreen></iframe>
                                  </div>
                              ) : (
                                  <div className="bg-gray-100 p-4 rounded text-center border-2 border-dashed border-gray-300">
                                      <input className="w-full p-2 border rounded text-xs mb-2" placeholder="Paste YouTube URL..." onBlur={(e) => onUpdate({ url: e.target.value })} onKeyDown={handleMediaKeyDown} autoFocus/>
                                  </div>
                              )}
                          </div>
                      )}
                      {block.type === 'link' && (
                          <div className="p-3 bg-blue-50 rounded border border-blue-100 flex items-center gap-3">
                              <LinkIcon size={20} className="text-blue-500"/>
                              <div className="flex-1 min-w-0">
                                  <input className="w-full bg-transparent font-medium text-blue-700 outline-none" value={block.content} onChange={(e) => onUpdate({ content: e.target.value })} onKeyDown={handleMediaKeyDown} placeholder="Link Title" autoFocus/>
                                  <input className="w-full bg-transparent text-xs text-blue-400 outline-none" value={block.url || ''} onChange={(e) => onUpdate({ url: e.target.value })} placeholder="https://example.com" />
                              </div>
                              {block.url && <a href={block.url} target="_blank" className="p-2 hover:bg-blue-100 rounded text-blue-600"><ChevronRight size={16}/></a>}
                          </div>
                      )}
                      {block.type === 'divider' && <div className="py-2"><hr className="border-t-2 border-gray-200" /></div>}
                  </div>
              </div>
              {showLightbox && block.url && <ImageLightbox src={block.url} onClose={() => setShowLightbox(false)} />}
          </>
      )
  }

  const DEFAULT_SETTINGS = {
    theme: 'light', // 'light', 'dark', 'system'
    maxColumns: 3,
    condensedView: false,
  };

  function App() {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [showSettings, setShowSettings] = useState(false);
    const [data, setData] = useState(INITIAL_DATA);
    const [activeNotebookId, setActiveNotebookId] = useState(null);
    const [activeTabId, setActiveTabId] = useState(null);
    const [activePageId, setActivePageId] = useState(null);
    const [editingPageId, setEditingPageId] = useState(null);
    const [editingTabId, setEditingTabId] = useState(null);
    const [editingNotebookId, setEditingNotebookId] = useState(null);
    const [draggedBlock, setDraggedBlock] = useState(null);
    const [dropTarget, setDropTarget] = useState(null); 
    const [activeTabMenu, setActiveTabMenu] = useState(null); 
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [autoFocusId, setAutoFocusId] = useState(null);
    const [selectedBlockId, setSelectedBlockId] = useState(null);
    const [blockMenu, setBlockMenu] = useState(null);
    const [notification, setNotification] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [showIconPicker, setShowIconPicker] = useState(false);
    const [showCoverInput, setShowCoverInput] = useState(false);
    const [notebookIconPicker, setNotebookIconPicker] = useState(null); // { id, top, left }
    const [tabIconPicker, setTabIconPicker] = useState(null); // { id, top, left }
    const titleInputRef = useRef(null);
    const [shouldFocusTitle, setShouldFocusTitle] = useState(false);
    const shouldFocusPageRef = useRef(false);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    // Creation flow tracking: { notebookId, tabId, pageId } - tracks IDs created together for Enter flow
    const [creationFlow, setCreationFlow] = useState(null);
    
    // Refs for focusing notebook/tab inputs
    const notebookInputRefs = useRef({});
    const tabInputRefs = useRef({});
    
    // Page type menu and import states
    const [showPageTypeMenu, setShowPageTypeMenu] = useState(false);
    const [showGoogleImport, setShowGoogleImport] = useState(false);
    const [googleImportType, setGoogleImportType] = useState('doc');
    const [googleImportUrl, setGoogleImportUrl] = useState('');
    const [showUrlImport, setShowUrlImport] = useState(false);
    const [urlImportType, setUrlImportType] = useState('web'); // 'web' or 'pdf'
    const [urlImportValue, setUrlImportValue] = useState('');
    const [favoritesExpanded, setFavoritesExpanded] = useState(false);
    const [showEditEmbed, setShowEditEmbed] = useState(false);
    const [editEmbedName, setEditEmbedName] = useState('');
    const [editEmbedUrl, setEditEmbedUrl] = useState('');
    const [editEmbedViewMode, setEditEmbedViewMode] = useState('edit'); // 'edit' or 'preview'
    const [editingEmbedName, setEditingEmbedName] = useState(false);

    useEffect(() => {
      // Load settings
      const savedSettings = localStorage.getItem('note-app-settings-v1');
      if (savedSettings) {
        try {
          setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) });
        } catch (e) { console.error(e); }
      }
      
      // Load data
      const saved = localStorage.getItem('note-app-data-v1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setData(parsed);
          if (parsed.notebooks.length > 0) {
            const firstNb = parsed.notebooks[0];
            setActiveNotebookId(firstNb.id);
            const tabId = firstNb.activeTabId || firstNb.tabs[0]?.id;
            setActiveTabId(tabId);
            if(tabId) {
               const tab = firstNb.tabs.find(t => t.id === tabId);
               if(tab) setActivePageId(tab.activePageId || tab.pages[0]?.id);
            }
          }
        } catch (e) { console.error(e); }
      } else {
        setActiveNotebookId(INITIAL_DATA.notebooks[0].id);
        setActiveTabId(INITIAL_DATA.notebooks[0].tabs[0].id);
        setActivePageId(INITIAL_DATA.notebooks[0].tabs[0].pages[0].id);
      }
    }, []);

    useEffect(() => { localStorage.setItem('note-app-data-v1', JSON.stringify(data)); }, [data]);
    
    // Save settings and apply theme
    useEffect(() => { 
        localStorage.setItem('note-app-settings-v1', JSON.stringify(settings));
        // Apply theme
        const root = document.documentElement;
        let effectiveTheme = settings.theme;
        if (settings.theme === 'system') {
            effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        root.classList.remove('light', 'dark');
        root.classList.add(effectiveTheme);
    }, [settings]);
    
    // Focus sidebar nav item logic
    useEffect(() => {
        if (shouldFocusPageRef.current && activePageId) {
            const el = document.getElementById(`nav-page-${activePageId}`);
            if (el) el.focus();
            shouldFocusPageRef.current = false;
        }
    }, [activePageId]);

    // Focus main Title logic
    useEffect(() => {
        if (shouldFocusTitle && titleInputRef.current) {
            titleInputRef.current.focus();
            titleInputRef.current.select();
            setShouldFocusTitle(false);
        }
    }, [activePageId, shouldFocusTitle]);

    // Focus notebook input when editing starts
    useEffect(() => {
        if (editingNotebookId && notebookInputRefs.current[editingNotebookId]) {
            setTimeout(() => {
                const input = notebookInputRefs.current[editingNotebookId];
                if (input) { input.focus(); input.select(); }
            }, 50);
        }
    }, [editingNotebookId]);

    // Focus tab input when editing starts
    useEffect(() => {
        if (editingTabId && tabInputRefs.current[editingTabId]) {
            setTimeout(() => {
                const input = tabInputRefs.current[editingTabId];
                if (input) { input.focus(); input.select(); }
            }, 50);
        }
    }, [editingTabId]);

    useEffect(() => {
      const handleClickOutside = (e) => {
         if (!e.target.closest('.tab-settings-trigger') && !e.target.closest('.tab-settings-menu')) setActiveTabMenu(null);
         if (!e.target.closest('.add-menu-container')) setShowAddMenu(false);
         if (!e.target.closest('.block-handle') && !e.target.closest('.block-menu')) {
             if (!e.target.closest('[contenteditable="true"]')) setSelectedBlockId(null);
             setBlockMenu(null);
         }
         if (editingTabId && !e.target.closest('.tab-input')) setEditingTabId(null);
         if (editingNotebookId && !e.target.closest('.notebook-input')) setEditingNotebookId(null);
         if (editingPageId && !e.target.closest('.page-input')) setEditingPageId(null);
         if (!e.target.closest('.icon-picker-trigger') && !e.target.closest('.icon-picker')) setShowIconPicker(false);
         if (!e.target.closest('.cover-input-trigger') && !e.target.closest('.cover-input')) setShowCoverInput(false);
         if (!e.target.closest('.notebook-icon-trigger') && !e.target.closest('.notebook-icon-picker')) setNotebookIconPicker(null);
         if (!e.target.closest('.tab-icon-trigger') && !e.target.closest('.tab-icon-picker')) setTabIconPicker(null);
         if (!e.target.closest('.settings-modal') && !e.target.closest('.settings-trigger')) setShowSettings(false);
         if (!e.target.closest('.page-type-menu') && !e.target.closest('.page-type-trigger')) setShowPageTypeMenu(false);
      };
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }, [editingTabId, editingNotebookId, editingPageId]);

    const showNotification = (message, type = 'info') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const saveToHistory = (newData) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newData ? newData : JSON.parse(JSON.stringify(data)));
        if (newHistory.length > 30) newHistory.shift();
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const undo = () => {
        if (historyIndex > 0) {
            const prevData = history[historyIndex - 1];
            setData(prevData);
            setHistoryIndex(historyIndex - 1);
            showNotification('Undo', 'info');
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            const nextData = history[historyIndex + 1];
            setData(nextData);
            setHistoryIndex(historyIndex + 1);
            showNotification('Redo', 'info');
        }
    };

    const activeNotebook = data.notebooks.find(n => n.id === activeNotebookId);
    const activeTab = activeNotebook?.tabs.find(t => t.id === activeTabId);
    const activePage = activeTab?.pages.find(p => p.id === activePageId);

    const updatePageContent = (rows, shouldSaveHistory = false) => {
      if (!activePageId || !activeTabId || !activeNotebookId) return;
      if (shouldSaveHistory) saveToHistory();
      const newData = {
        ...data,
        notebooks: data.notebooks.map(nb => 
          nb.id !== activeNotebookId ? nb : {
              ...nb,
              tabs: nb.tabs.map(tab => 
                  tab.id !== activeTabId ? tab : {
                      ...tab,
                      pages: tab.pages.map(page => 
                          page.id !== activePageId ? page : { ...page, rows }
                      )
                  }
              )
          }
        )
      };
      setData(newData);
      if (shouldSaveHistory) saveToHistory(newData);
    };

    const updatePageMeta = (updates) => {
        if (!activePageId) return;
        saveToHistory();
        setData(prev => ({
            ...prev,
            notebooks: prev.notebooks.map(nb => 
                nb.id !== activeNotebookId ? nb : {
                    ...nb,
                    tabs: nb.tabs.map(tab => 
                        tab.id !== activeTabId ? tab : {
                            ...tab,
                            pages: tab.pages.map(page => 
                                page.id !== activePageId ? page : { ...page, ...updates }
                            )
                        }
                    )
                }
            )
        }));
    }

    const removeBlock = (blockId) => {
        let newRows = activePage.rows.map(row => ({
            ...row,
            columns: row.columns.map(col => ({
                ...col,
                blocks: col.blocks.filter(b => b.id !== blockId)
            })).filter(col => col.blocks.length > 0)
        })).filter(row => row.columns.length > 0);
        updatePageContent(newRows, true);
        showNotification('Block deleted', 'success');
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const redoKey = isMac ? (e.metaKey && e.shiftKey && e.key.toLowerCase() === 'z') : (e.ctrlKey && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z')));
            const undoKey = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey;

            if (redoKey) { e.preventDefault(); redo(); } 
            else if (undoKey) { e.preventDefault(); undo(); }
            
            if (selectedBlockId && e.key === 'Delete') {
                e.preventDefault();
                removeBlock(selectedBlockId);
                setSelectedBlockId(null);
                setBlockMenu(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [history, historyIndex, data, selectedBlockId]);

    const selectNotebook = (notebookId) => {
        const nb = data.notebooks.find(n => n.id === notebookId);
        if (!nb) return;
        setActiveNotebookId(notebookId);
        setEditingPageId(null);
        setEditingTabId(null);
        setEditingNotebookId(null);
        const targetTabId = nb.activeTabId || (nb.tabs && nb.tabs[0] ? nb.tabs[0].id : null);
        setActiveTabId(targetTabId);
        if (targetTabId) {
            const tab = nb.tabs.find(t => t.id === targetTabId);
            setActivePageId(tab ? (tab.activePageId || (tab.pages && tab.pages[0] ? tab.pages[0].id : null)) : null);
        } else {
            setActivePageId(null);
        }
    };

    const selectTab = (tabId) => {
        setActiveTabId(tabId);
        setEditingPageId(null);
        setEditingTabId(null);
        setEditingNotebookId(null);
        setData(prev => ({
            ...prev,
            notebooks: prev.notebooks.map(nb => 
                nb.id === activeNotebookId ? { ...nb, activeTabId: tabId } : nb
            )
        }));
        const nb = data.notebooks.find(n => n.id === activeNotebookId);
        const tab = nb?.tabs.find(t => t.id === tabId);
        if (tab) {
            setActivePageId(tab.activePageId || (tab.pages && tab.pages[0] ? tab.pages[0].id : null));
        }
    };

    const selectPage = (pageId) => {
        setActivePageId(pageId);
        setEditingPageId(null);
        setEditingTabId(null);
        setEditingNotebookId(null);
        // Persist the last open page to the tab
        setData(prev => ({
            ...prev,
            notebooks: prev.notebooks.map(nb => 
                nb.id !== activeNotebookId ? nb : {
                    ...nb,
                    tabs: nb.tabs.map(t => 
                        t.id === activeTabId ? { ...t, activePageId: pageId } : t
                    )
                }
            )
        }));
    };

    const toggleStar = (pageId, notebookId, tabId) => {
        setData(prev => ({
            ...prev,
            notebooks: prev.notebooks.map(nb => 
                nb.id !== notebookId ? nb : {
                    ...nb,
                    tabs: nb.tabs.map(t => 
                        t.id !== tabId ? t : {
                            ...t,
                            pages: t.pages.map(p => 
                                p.id === pageId ? { ...p, starred: !p.starred } : p
                            )
                        }
                    )
                }
            )
        }));
    };

    // Get all starred pages across all notebooks/tabs
    const getStarredPages = () => {
        const starred = [];
        data.notebooks.forEach(nb => {
            nb.tabs.forEach(tab => {
                tab.pages.forEach(page => {
                    if (page.starred) {
                        starred.push({
                            ...page,
                            notebookId: nb.id,
                            tabId: tab.id,
                            notebookName: nb.name,
                            tabName: tab.name
                        });
                    }
                });
            });
        });
        return starred;
    };

    // Helper to create a default page with one empty text block
    const createDefaultPage = (name = 'New Page') => {
      const blockId = generateId();
      return { 
        id: generateId(), 
        name, 
        createdAt: Date.now(), 
        rows: [{ id: generateId(), columns: [{ id: generateId(), blocks: [{ id: blockId, type: 'text', content: '' }] }] }], 
        icon: '📄', 
        cover: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
        _firstBlockId: blockId // Track for auto-focus
      };
    };

    const addNotebook = () => {
      saveToHistory();
      const newPage = createDefaultPage();
      const newTab = { id: generateId(), name: 'New Tab', icon: '📋', color: 'blue', pages: [newPage], activePageId: newPage.id };
      const newNb = { id: generateId(), name: 'New Notebook', icon: '📓', tabs: [newTab], activeTabId: newTab.id };
      const newData = { ...data, notebooks: [...data.notebooks, newNb] };
      setData(newData);
      saveToHistory(newData);
      setActiveNotebookId(newNb.id);
      setActiveTabId(newTab.id);
      setActivePageId(newPage.id);
      setEditingPageId(null);
      setEditingTabId(null);
      setEditingNotebookId(newNb.id);
      // Set creation flow to enable Enter key navigation: notebook → tab → page title
      setCreationFlow({ notebookId: newNb.id, tabId: newTab.id, pageId: newPage.id });
      showNotification('Notebook created', 'success');
    };

    const addTab = () => {
      if (!activeNotebookId) return;
      saveToHistory();
      const newPage = createDefaultPage();
      const newTab = { id: generateId(), name: 'New Tab', icon: '📋', color: 'blue', pages: [newPage], activePageId: newPage.id };
      const newData = {
        ...data,
        notebooks: data.notebooks.map(nb => 
          nb.id === activeNotebookId ? { ...nb, tabs: [...nb.tabs, newTab], activeTabId: newTab.id } : nb
        )
      };
      setData(newData);
      saveToHistory(newData);
      setActiveTabId(newTab.id);
      setActivePageId(newPage.id);
      setEditingPageId(null);
      setEditingTabId(newTab.id);
      setEditingNotebookId(null);
      showNotification('Section created', 'success');
    };

    const addPage = () => {
      if (!activeTabId) return;
      saveToHistory();
      const newPage = createDefaultPage();
      const newData = {
        ...data,
        notebooks: data.notebooks.map(nb => 
          nb.id !== activeNotebookId ? nb : {
              ...nb,
              tabs: nb.tabs.map(tab => 
                  tab.id !== activeTabId ? tab : {
                      ...tab,
                      pages: [...tab.pages, newPage],
                      activePageId: newPage.id
                  }
              )
          }
        )
      };
      setData(newData);
      saveToHistory(newData);
      setActivePageId(newPage.id);
      setEditingPageId(null);  // Don't edit in sidebar
      setEditingTabId(null);
      setEditingNotebookId(null);
      setShouldFocusTitle(true); // Focus main title
      showNotification('Page created', 'success');
    };

    const handleGoogleImport = () => {
      if (!activeTabId || !googleImportUrl) return;
      
      // Extract document ID from URL
      const match = googleImportUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (!match) {
        showNotification('Invalid Google URL. Please paste a valid Docs, Sheets, or Slides URL.', 'error');
        return;
      }
      
      const docId = match[1];
      let embedUrl, icon, typeName;
      
      switch(googleImportType) {
        case 'doc':
          embedUrl = `https://docs.google.com/document/d/${docId}/edit`;
          icon = '📄';
          typeName = 'Doc';
          break;
        case 'sheet':
          embedUrl = `https://docs.google.com/spreadsheets/d/${docId}/edit`;
          icon = '📊';
          typeName = 'Sheet';
          break;
        case 'slide':
          embedUrl = `https://docs.google.com/presentation/d/${docId}/edit`;
          icon = '📽️';
          typeName = 'Slides';
          break;
        default:
          return;
      }
      
      saveToHistory();
      const newPage = {
        id: generateId(),
        name: `Google ${typeName}`,
        type: googleImportType, // 'doc', 'sheet', 'slide'
        embedUrl,
        icon,
        createdAt: Date.now()
      };
      
      const newData = {
        ...data,
        notebooks: data.notebooks.map(nb => 
          nb.id !== activeNotebookId ? nb : {
            ...nb,
            tabs: nb.tabs.map(tab => 
              tab.id !== activeTabId ? tab : {
                ...tab,
                pages: [...tab.pages, newPage],
                activePageId: newPage.id
              }
            )
          }
        )
      };
      
      setData(newData);
      saveToHistory(newData);
      setActivePageId(newPage.id);
      setShowGoogleImport(false);
      setGoogleImportUrl('');
      setGoogleImportType('doc');
      showNotification(`Google ${typeName} added`, 'success');
    };

    const handleUrlImport = () => {
      if (!activeTabId || !urlImportValue) return;
      
      // Auto-correct URL: add https:// if missing
      let url = urlImportValue.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      
      let embedUrl, icon, pageName, pageType;
      
      if (urlImportType === 'web') {
        embedUrl = url;
        icon = '🌐';
        pageName = 'Web Page';
        pageType = 'web';
      } else if (urlImportType === 'pdf') {
        icon = '📑';
        pageName = 'PDF Document';
        pageType = 'pdf';
        
        // Check if it's a Google Drive sharing URL
        const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (driveMatch) {
          // Convert Google Drive sharing URL to preview embed
          const fileId = driveMatch[1];
          embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
        } else {
          // Use Google's PDF viewer for direct PDF URLs
          embedUrl = `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(url)}`;
        }
      }
      
      saveToHistory();
      const newPage = {
        id: generateId(),
        name: pageName,
        type: pageType,
        embedUrl,
        originalUrl: url, // Store corrected URL for reference
        icon,
        createdAt: Date.now()
      };
      
      const newData = {
        ...data,
        notebooks: data.notebooks.map(nb => 
          nb.id !== activeNotebookId ? nb : {
            ...nb,
            tabs: nb.tabs.map(tab => 
              tab.id !== activeTabId ? tab : {
                ...tab,
                pages: [...tab.pages, newPage],
                activePageId: newPage.id
              }
            )
          }
        )
      };
      
      setData(newData);
      saveToHistory(newData);
      setActivePageId(newPage.id);
      setShowUrlImport(false);
      setUrlImportValue('');
      showNotification(`${pageName} added`, 'success');
    };

    const openEditEmbed = () => {
      if (!activePage || !activePage.embedUrl) return;
      setEditEmbedName(activePage.name);
      setEditEmbedUrl(activePage.originalUrl || activePage.embedUrl);
      // Determine current view mode from embedUrl
      const isPreview = activePage.embedUrl.includes('/preview');
      setEditEmbedViewMode(isPreview ? 'preview' : 'edit');
      setShowEditEmbed(true);
    };

    const handleSaveEmbed = () => {
      if (!activePage || !editEmbedName) return;
      
      // Auto-correct URL
      let url = editEmbedUrl.trim();
      if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      
      // Calculate new embed URL based on page type and view mode
      let newEmbedUrl = activePage.embedUrl;
      const pageType = activePage.type;
      const viewSuffix = editEmbedViewMode === 'preview' ? 'preview' : 'edit';
      
      if (pageType === 'web') {
        newEmbedUrl = url || activePage.embedUrl;
      } else if (pageType === 'pdf') {
        if (url && url !== (activePage.originalUrl || activePage.embedUrl)) {
          // Check if it's a Google Drive URL
          const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
          if (driveMatch) {
            newEmbedUrl = `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
          } else {
            newEmbedUrl = `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(url)}`;
          }
        }
      } else if (['doc', 'sheet', 'slide'].includes(pageType)) {
        // Extract document ID from current or new URL
        const sourceUrl = url || activePage.originalUrl || activePage.embedUrl;
        const match = sourceUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (match) {
          const docId = match[1];
          if (pageType === 'doc') {
            newEmbedUrl = `https://docs.google.com/document/d/${docId}/${viewSuffix}`;
          } else if (pageType === 'sheet') {
            newEmbedUrl = `https://docs.google.com/spreadsheets/d/${docId}/${viewSuffix}`;
          } else if (pageType === 'slide') {
            newEmbedUrl = `https://docs.google.com/presentation/d/${docId}/${viewSuffix}`;
          }
        }
      }
      
      setData(prev => ({
        ...prev,
        notebooks: prev.notebooks.map(nb => 
          nb.id !== activeNotebookId ? nb : {
            ...nb,
            tabs: nb.tabs.map(tab => 
              tab.id !== activeTabId ? tab : {
                ...tab,
                pages: tab.pages.map(p => 
                  p.id !== activePage.id ? p : {
                    ...p,
                    name: editEmbedName,
                    embedUrl: newEmbedUrl,
                    originalUrl: url || p.originalUrl
                  }
                )
              }
            )
          }
        )
      }));
      
      setShowEditEmbed(false);
      showNotification('Page updated', 'success');
    };

    const addBlock = (type) => {
        if (!activePage) return;
        const newBlock = { id: generateId(), type, content: '', url: '' };
        const newRow = { id: generateId(), columns: [{ id: generateId(), blocks: [newBlock] }] };
        updatePageContent([...activePage.rows, newRow], true);
        setShowAddMenu(false);
        setAutoFocusId(newBlock.id);
    };

    const insertBlockAfter = (targetBlockId, blockType = 'text') => {
      if (!activePage) return;
      const newBlock = { id: generateId(), type: blockType, content: '', url: '', ...(blockType === 'todo' ? { checked: false } : {}) };
      let newRows = JSON.parse(JSON.stringify(activePage.rows));
      for (let row of newRows) {
          for (let col of row.columns) {
              const index = col.blocks.findIndex(b => b.id === targetBlockId);
              if (index > -1) {
                  col.blocks.splice(index + 1, 0, newBlock);
                  updatePageContent(newRows, true);
                  setAutoFocusId(newBlock.id);
                  return;
              }
          }
      }
    };

    const updateBlock = (blockId, updates) => {
      const newRows = activePage.rows.map(row => ({
          ...row,
          columns: row.columns.map(col => ({
              ...col,
              blocks: col.blocks.map(block => block.id === blockId ? { ...block, ...updates } : block)
          }))
      }));
      updatePageContent(newRows, false);
    };

    const updateTabColor = (tabId, color) => {
        const newData = {
          ...data,
          notebooks: data.notebooks.map(nb => 
            nb.id !== activeNotebookId ? nb : {
              ...nb,
              tabs: nb.tabs.map(tab => tab.id !== tabId ? tab : { ...tab, color })
            }
          )
        };
        setData(newData);
        setActiveTabMenu(null);
    };

    const updateNotebookIcon = (notebookId, icon) => {
        setData(prev => ({
            ...prev,
            notebooks: prev.notebooks.map(nb => 
                nb.id === notebookId ? { ...nb, icon } : nb
            )
        }));
        setNotebookIconPicker(null);
    };

    const updateTabIcon = (tabId, icon) => {
        setData(prev => ({
            ...prev,
            notebooks: prev.notebooks.map(nb => 
                nb.id !== activeNotebookId ? nb : {
                    ...nb,
                    tabs: nb.tabs.map(tab => tab.id === tabId ? { ...tab, icon } : tab)
                }
            )
        }));
        setTabIconPicker(null);
    };

    const renameItem = (type, id, newName) => {
        setData(prev => {
            const next = JSON.parse(JSON.stringify(prev));
            next.notebooks.forEach(nb => {
                if (type === 'notebook' && nb.id === id) nb.name = newName;
                nb.tabs.forEach(tab => {
                    if (type === 'tab' && tab.id === id) tab.name = newName;
                    tab.pages.forEach(pg => {
                        if (pg.id === id) pg.name = newName;
                    });
                });
            });
            return next;
        });
    }

    const initiateDelete = (type, id) => setItemToDelete({ type, id });

    const executeDelete = (type, id) => {
        saveToHistory();
        const newData = JSON.parse(JSON.stringify(data));
        let nextId = null;

        if(type === 'notebook') {
             const idx = newData.notebooks.findIndex(n => n.id === id);
             if (activeNotebookId === id) {
                 if (idx < newData.notebooks.length - 1) nextId = newData.notebooks[idx + 1].id;
                 else if (idx > 0) nextId = newData.notebooks[idx - 1].id;
             }
             newData.notebooks = newData.notebooks.filter(n => n.id !== id);
             if (activeNotebookId === id) setActiveNotebookId(nextId);
        } else {
             for (let nb of newData.notebooks) {
                 if (nb.id !== activeNotebookId) continue;
                 if (type === 'tab') {
                     const idx = nb.tabs.findIndex(t => t.id === id);
                     if (activeTabId === id) {
                         if (idx < nb.tabs.length - 1) nextId = nb.tabs[idx + 1].id;
                         else if (idx > 0) nextId = nb.tabs[idx - 1].id;
                     }
                     nb.tabs = nb.tabs.filter(t => t.id !== id);
                     if (activeTabId === id) {
                         selectTab(nextId);
                     }
                 } else if (type === 'page') {
                     for (let tab of nb.tabs) {
                         if (tab.id !== activeTabId) continue;
                         const idx = tab.pages.findIndex(p => p.id === id);
                         if (activePageId === id) {
                             if (idx < tab.pages.length - 1) nextId = tab.pages[idx + 1].id;
                             else if (idx > 0) nextId = tab.pages[idx - 1].id;
                         }
                         tab.pages = tab.pages.filter(p => p.id !== id);
                         if (activePageId === id) {
                             selectPage(nextId);
                             if (nextId) shouldFocusPageRef.current = true;
                         }
                     }
                 }
             }
        }
        setData(newData);
        saveToHistory(newData);
        if (itemToDelete && itemToDelete.id === id) setItemToDelete(null);
        if (activeTabMenu && activeTabMenu.id === id) setActiveTabMenu(null);
        if (selectedBlockId === id) setSelectedBlockId(null);
        showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted`, 'success');
    }

    const confirmDelete = () => {
        if (!itemToDelete) return;
        executeDelete(itemToDelete.type, itemToDelete.id);
    }

    const handleNavDragStart = (e, type, id, index) => {
        e.dataTransfer.setData('nav_drag', JSON.stringify({ type, id, index }));
    };

    const handleNavDrop = (e, type, targetIndex) => {
        e.preventDefault(); e.stopPropagation();
        const dragDataRaw = e.dataTransfer.getData('nav_drag');
        if (!dragDataRaw) return;
        const dragData = JSON.parse(dragDataRaw);
        if (dragData.type !== type || dragData.index === targetIndex) return;

        saveToHistory();
        const newData = JSON.parse(JSON.stringify(data));
        if (type === 'notebook') {
            const item = newData.notebooks.splice(dragData.index, 1)[0];
            newData.notebooks.splice(targetIndex, 0, item);
        } else if (type === 'tab') {
            const nb = newData.notebooks.find(n => n.id === activeNotebookId);
            if (nb) {
                const item = nb.tabs.splice(dragData.index, 1)[0];
                nb.tabs.splice(targetIndex, 0, item);
            }
        } else if (type === 'page') {
            const nb = newData.notebooks.find(n => n.id === activeNotebookId);
            const tab = nb?.tabs.find(t => t.id === activeTabId);
            if (tab) {
                const item = tab.pages.splice(dragData.index, 1)[0];
                tab.pages.splice(targetIndex, 0, item);
            }
        }
        setData(newData);
        saveToHistory(newData);
    };

    const handleDragStart = (e, block, rowId, colId) => {
        e.dataTransfer.setData('block_drag', JSON.stringify({ block, rowId, colId }));
        setDraggedBlock({ block, rowId, colId });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (!draggedBlock || !dropTarget) { setDraggedBlock(null); setDropTarget(null); return; }
        const { block } = draggedBlock;
        const { rowId: tgtRowId, colId: tgtColId, blockId: tgtBlockId, position } = dropTarget;

        let newRows = JSON.parse(JSON.stringify(activePage.rows));
        let movedBlock = null;
        
        // Remove the dragged block from its original position
        newRows.forEach(row => { row.columns.forEach(col => { const idx = col.blocks.findIndex(b => b.id === block.id); if (idx > -1) { movedBlock = col.blocks[idx]; col.blocks.splice(idx, 1); } }); });
        newRows.forEach(row => { row.columns = row.columns.filter(c => c.blocks.length > 0); });
        newRows = newRows.filter(r => r.columns.length > 0);

        if (movedBlock) {
            if (position === 'left' || position === 'right') {
                // Find the target row and column
                const targetRowIndex = newRows.findIndex(r => r.id === tgtRowId);
                if (targetRowIndex > -1) {
                    const targetRow = newRows[targetRowIndex];
                    const targetColIndex = targetRow.columns.findIndex(c => c.id === tgtColId);
                    const targetCol = targetRow.columns[targetColIndex];
                    
                    if (targetCol) {
                        const targetBlockIndex = targetCol.blocks.findIndex(b => b.id === tgtBlockId);
                        
                        // Check if this column has multiple blocks
                        if (targetCol.blocks.length > 1) {
                            // Split the row: extract just the target block into a new row with columns
                            const blocksAbove = targetCol.blocks.slice(0, targetBlockIndex);
                            const targetBlock = targetCol.blocks[targetBlockIndex];
                            const blocksBelow = targetCol.blocks.slice(targetBlockIndex + 1);
                            
                            // Create new rows
                            const rowsToInsert = [];
                            
                            // Row for blocks above (if any)
                            if (blocksAbove.length > 0) {
                                rowsToInsert.push({ id: generateId(), columns: [{ id: generateId(), blocks: blocksAbove }] });
                            }
                            
                            // Row with the two-column arrangement
                            const col1 = { id: generateId(), blocks: [position === 'left' ? movedBlock : targetBlock] };
                            const col2 = { id: generateId(), blocks: [position === 'left' ? targetBlock : movedBlock] };
                            rowsToInsert.push({ id: generateId(), columns: [col1, col2] });
                            
                            // Row for blocks below (if any)
                            if (blocksBelow.length > 0) {
                                rowsToInsert.push({ id: generateId(), columns: [{ id: generateId(), blocks: blocksBelow }] });
                            }
                            
                            // Remove the original column/row and insert new rows
                            targetCol.blocks = [];
                            newRows.forEach(row => { row.columns = row.columns.filter(c => c.blocks.length > 0); });
                            newRows = newRows.filter(r => r.columns.length > 0);
                            
                            // Find where to insert (the old row index, adjusted for filtering)
                            const insertIndex = targetRowIndex <= newRows.length ? targetRowIndex : newRows.length;
                            newRows.splice(insertIndex, 0, ...rowsToInsert);
                        } else {
                            // Single block in column - can add column directly if under max
                            if (targetRow.columns.length < settings.maxColumns) {
                                const newCol = { id: generateId(), blocks: [movedBlock] };
                                if (position === 'left') targetRow.columns.splice(targetColIndex, 0, newCol);
                                else targetRow.columns.splice(targetColIndex + 1, 0, newCol);
                            } else {
                                // Max columns reached - add to the column instead
                                targetCol.blocks.push(movedBlock);
                            }
                        }
                    }
                }
            } else {
                // Top/bottom drop - add to existing column
                const targetRow = newRows.find(r => r.id === tgtRowId);
                const targetCol = targetRow?.columns.find(c => c.id === tgtColId);
                if (targetCol) {
                    const targetBlockIndex = targetCol.blocks.findIndex(b => b.id === tgtBlockId);
                    const insertIndex = position === 'top' ? targetBlockIndex : targetBlockIndex + 1;
                    targetCol.blocks.splice(insertIndex, 0, movedBlock);
                }
            }
        }
        updatePageContent(newRows, true);
        setDraggedBlock(null); setDropTarget(null);
    };

    const getTabColorClasses = (colorName, isActive) => {
        const colors = {
            gray: 'bg-gray-100 hover:bg-gray-200 text-gray-800', red: 'bg-red-100 hover:bg-red-200 text-red-800',
            orange: 'bg-orange-100 hover:bg-orange-200 text-orange-800', amber: 'bg-amber-100 hover:bg-amber-200 text-amber-800',
            green: 'bg-green-100 hover:bg-green-200 text-green-800', teal: 'bg-teal-100 hover:bg-teal-200 text-teal-800',
            blue: 'bg-blue-100 hover:bg-blue-200 text-blue-800', indigo: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-800',
            purple: 'bg-purple-100 hover:bg-purple-200 text-purple-800', pink: 'bg-pink-100 hover:bg-pink-200 text-pink-800',
        };
        const activeColors = {
             gray: 'bg-gray-500 text-white', red: 'bg-red-500 text-white', orange: 'bg-orange-500 text-white',
             amber: 'bg-amber-500 text-white', green: 'bg-green-600 text-white', teal: 'bg-teal-600 text-white',
             blue: 'bg-blue-600 text-white', indigo: 'bg-indigo-600 text-white', purple: 'bg-purple-600 text-white',
             pink: 'bg-pink-600 text-white',
        };
        return isActive ? activeColors[colorName] : colors[colorName];
    };

    const getPageBgClass = (colorName) => {
         const map = {
            gray: 'bg-gray-100', red: 'bg-red-100', orange: 'bg-orange-100', amber: 'bg-amber-100',
            green: 'bg-green-100', teal: 'bg-teal-100', blue: 'bg-blue-100', indigo: 'bg-indigo-100',
            purple: 'bg-purple-100', pink: 'bg-pink-100',
         }
         return map[colorName] || 'bg-white';
    }

    const handleBlockHandleClick = (e, blockId) => {
        e.stopPropagation();
        if (selectedBlockId === blockId) {
            const rect = e.currentTarget.getBoundingClientRect();
            setBlockMenu({ id: blockId, top: rect.bottom + 5, left: rect.left });
        } else {
            setSelectedBlockId(blockId);
            setBlockMenu(null);
            if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
        }
    }

    const updateBlockColor = (blockId, colorName) => {
        updateBlock(blockId, { backgroundColor: colorName });
        setBlockMenu(null);
    }

    const handlePageKeyDown = (e, pageId, index, pages) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (index < pages.length - 1) { selectPage(pages[index + 1].id); shouldFocusPageRef.current = true; }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (index > 0) { selectPage(pages[index - 1].id); shouldFocusPageRef.current = true; }
        } else if (e.key === 'Delete') {
            e.preventDefault(); executeDelete('page', pageId);
        }
    };

    const handleTitleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.target.blur();
            if (activePage && activePage.rows.length > 0 && activePage.rows[0].columns.length > 0 && activePage.rows[0].columns[0].blocks.length > 0) {
                setAutoFocusId(activePage.rows[0].columns[0].blocks[0].id);
            } else {
                // If page is empty, create a new text block
                addBlock('text');
            }
        }
    };

    return (
      <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans text-sm">
        {/* NOTEBOOKS SIDEBAR */}
        <div className={`${settings.condensedView ? 'w-16' : 'w-64'} flex-shrink-0 flex flex-col border-r border-gray-200 bg-gray-900 text-gray-300 transition-all duration-200`}>
          <div className={`p-4 border-b border-gray-800 flex items-center ${settings.condensedView ? 'justify-center' : 'justify-between'}`}>
              {!settings.condensedView && <span className="font-bold text-white flex items-center gap-2 text-lg"><Book size={18}/> Notebooks</span>}
              <button onClick={addNotebook} className="hover:bg-gray-800 p-1 rounded transition-colors" title="Add notebook"><Plus size={18} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {/* Favorites Section - Collapsible */}
            {getStarredPages().length > 0 && (
              <div className="mb-2">
                <button 
                  onClick={() => setFavoritesExpanded(!favoritesExpanded)}
                  className={`w-full flex items-center ${settings.condensedView ? 'justify-center' : 'gap-2'} px-2 py-1.5 text-yellow-400 hover:bg-gray-800 rounded transition-colors`}
                >
                  <ChevronRight size={14} className={`transition-transform ${favoritesExpanded ? 'rotate-90' : ''} ${settings.condensedView ? 'hidden' : ''}`} />
                  <Star size={14} filled />
                  {!settings.condensedView && (
                    <>
                      <span className="text-xs font-semibold uppercase tracking-wider">Favorites</span>
                      <span className="text-xs text-gray-500 ml-auto">{getStarredPages().length}</span>
                    </>
                  )}
                </button>
                {favoritesExpanded && getStarredPages().map(page => (
                  <div 
                    key={`fav-${page.id}`}
                    onClick={() => {
                      setActiveNotebookId(page.notebookId);
                      setActiveTabId(page.tabId);
                      setActivePageId(page.id);
                    }}
                    className={`flex items-center ${settings.condensedView ? 'justify-center' : 'gap-2 ml-4'} px-3 py-1.5 rounded cursor-pointer transition-colors hover:bg-gray-800 ${activePageId === page.id ? 'bg-gray-800 text-white' : ''}`}
                    title={settings.condensedView ? `${page.name} (${page.notebookName} / ${page.tabName})` : undefined}
                  >
                    <span className="text-sm">{page.icon || '📄'}</span>
                    {!settings.condensedView && (
                      <div className="flex-1 min-w-0">
                        <div className="text-sm truncate">{page.name}</div>
                        <div className="text-xs text-gray-500 truncate">{page.notebookName} / {page.tabName}</div>
                      </div>
                    )}
                  </div>
                ))}
                <div className="border-b border-gray-700 my-2"></div>
              </div>
            )}
            
            {data.notebooks.map((nb, index) => (
              <div key={nb.id} className="group flex items-center gap-2" draggable={!editingNotebookId} onDragStart={(e) => handleNavDragStart(e, 'notebook', nb.id, index)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleNavDrop(e, 'notebook', index)} title={settings.condensedView ? nb.name : undefined}>
                   <div onClick={() => selectNotebook(nb.id)} className={`flex-1 flex items-center ${settings.condensedView ? 'justify-center' : 'gap-2'} px-3 py-2 rounded cursor-pointer transition-colors ${activeNotebookId === nb.id ? 'bg-gray-800 text-white font-medium' : 'hover:bg-gray-800'}`}>
                      <span 
                          className={`${settings.condensedView ? 'text-xl' : 'text-base'} ${settings.condensedView ? '' : 'cursor-pointer hover:bg-gray-700'} rounded px-0.5 notebook-icon-trigger`} 
                          onClick={(e) => { 
                              if (settings.condensedView) return; // Don't open picker in condensed view
                              e.stopPropagation(); 
                              const rect = e.currentTarget.getBoundingClientRect();
                              setNotebookIconPicker({ id: nb.id, top: rect.bottom + 5, left: rect.left });
                          }}
                      >
                          {nb.icon || '📓'}
                      </span>
                      {!settings.condensedView && (activeNotebookId === nb.id && editingNotebookId === nb.id ? (
                          <input ref={(el) => notebookInputRefs.current[nb.id] = el} className="bg-transparent border-none outline-none w-full notebook-input" value={nb.name} onChange={(e) => renameItem('notebook', nb.id, e.target.value)} onClick={(e) => e.stopPropagation()} onFocus={(e) => e.target.select()} onBlur={() => { if (!creationFlow) setEditingNotebookId(null); }} onKeyDown={(e) => { 
                              if(e.key === 'Enter') {
                                  e.preventDefault();
                                  setEditingNotebookId(null);
                                  // If in creation flow, move to tab name editing
                                  if (creationFlow && creationFlow.notebookId === nb.id) {
                                      setEditingTabId(creationFlow.tabId);
                                  }
                              }
                              if(e.key === 'Escape') {
                                  setEditingNotebookId(null);
                                  setCreationFlow(null);
                              }
                              e.stopPropagation(); 
                          }} />
                      ) : (
                          <span className="truncate w-full" onClick={(e) => { if(activeNotebookId === nb.id) { e.stopPropagation(); setEditingNotebookId(nb.id); } }}>{nb.name}</span>
                      ))}
                  </div>
                  {!settings.condensedView && <button onClick={() => initiateDelete('notebook', nb.id)} className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-1 transition-opacity"><Trash2 size={12}/></button>}
              </div>
            ))}
          </div>
          {/* Bottom toolbar */}
          <div className={`p-2 border-t border-gray-800 flex ${settings.condensedView ? 'flex-col gap-1' : 'justify-center gap-2'}`}>
              <button onClick={() => setSettings(s => ({...s, condensedView: !s.condensedView}))} className="hover:bg-gray-800 p-2 rounded transition-colors" title={settings.condensedView ? "Expand view" : "Compact view"}>
                  {settings.condensedView ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
              </button>
              <button onClick={() => setShowSettings(true)} className="hover:bg-gray-800 p-2 rounded transition-colors settings-trigger" title="Settings">
                  <Settings size={18} />
              </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col h-full min-w-0">
          {/* TABS BAR */}
          {activeNotebook ? (
               <div className="h-12 flex-shrink-0 bg-gray-100 border-b border-gray-300 flex items-end px-2 space-x-1 overflow-x-auto no-scrollbar">
               {activeNotebook.tabs.map((tab, index) => (
                 <div key={tab.id} className="group relative" draggable={!editingTabId} onDragStart={(e) => handleNavDragStart(e, 'tab', tab.id, index)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleNavDrop(e, 'tab', index)}>
                     <div onClick={() => selectTab(tab.id)} className={`${settings.condensedView ? 'px-2 min-w-[50px] max-w-[80px]' : 'px-4 min-w-[120px] max-w-[200px]'} py-2 rounded-t-lg cursor-pointer flex items-center gap-2 border-t border-l border-r border-transparent ${activeTabId === tab.id ? `${getTabColorClasses(tab.color, true)} shadow-sm !border-gray-300 translate-y-[1px]` : `${getTabColorClasses(tab.color, false)} mb-1`}`} title={settings.condensedView ? tab.name : undefined}>
                      <span 
                          className={`text-sm ${settings.condensedView ? '' : 'cursor-pointer hover:bg-black/10'} rounded px-0.5 tab-icon-trigger`} 
                          onClick={(e) => { 
                              if (settings.condensedView) return; // Don't open picker in condensed view
                              e.stopPropagation(); 
                              const rect = e.currentTarget.getBoundingClientRect();
                              setTabIconPicker({ id: tab.id, top: rect.bottom + 5, left: rect.left });
                          }}
                      >
                          {tab.icon || '📋'}
                      </span>
                      {!settings.condensedView && (activeTabId === tab.id && editingTabId === tab.id ? (
                          <input ref={(el) => tabInputRefs.current[tab.id] = el} className="bg-transparent border-none outline-none w-full font-medium tab-input" value={tab.name} onChange={(e) => renameItem('tab', tab.id, e.target.value)} onFocus={(e) => e.target.select()} onBlur={() => { if (!creationFlow) setEditingTabId(null); }} onKeyDown={(e) => { 
                              if(e.key === 'Enter') {
                                  e.preventDefault();
                                  setEditingTabId(null);
                                  // If in creation flow, move to page title
                                  if (creationFlow && creationFlow.tabId === tab.id) {
                                      setShouldFocusTitle(true);
                                      setCreationFlow(null); // End the flow
                                  }
                              }
                              if(e.key === 'Escape') {
                                  setEditingTabId(null);
                                  setCreationFlow(null);
                              }
                              e.stopPropagation(); 
                          }} onClick={(e) => e.stopPropagation()} />
                      ) : (
                          <span className="truncate font-medium w-full" onClick={(e) => { if(activeTabId === tab.id) { e.stopPropagation(); setEditingTabId(tab.id); } }}>{tab.name}</span>
                      ))}
                       {!settings.condensedView && <div className="relative ml-auto">
                          <button className={`p-1 rounded hover:bg-black/10 tab-settings-trigger ${activeTabId === tab.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} onClick={(e) => {
                                  e.stopPropagation();
                                  if (activeTabMenu?.id === tab.id) setActiveTabMenu(null);
                                  else { const rect = e.currentTarget.getBoundingClientRect(); setActiveTabMenu({ id: tab.id, top: rect.bottom + 5, left: rect.left }); }
                              }}>
                             <Settings size={12} />
                          </button>
                       </div>}
                     </div>
                 </div>
               ))}
               <button onClick={addTab} className="mb-2 p-1 hover:bg-gray-200 rounded text-gray-500 transition-colors"><Plus size={18}/></button>
             </div>
          ) : (
              <div className="h-12 bg-gray-100 border-b border-gray-300 flex items-center px-4 text-gray-400">Select a notebook</div>
          )}

          <div className="flex-1 flex overflow-hidden">
              <div className={`flex-1 overflow-y-auto ${activePage?.embedUrl ? 'p-0' : 'p-8'} transition-colors duration-300 ${activeTab ? getPageBgClass(activeTab.color) : 'bg-gray-50'}`}>
                  {activePage ? (
                      activePage.embedUrl ? (
                          // Embedded page (Google Docs/Sheets/Slides, Web, PDF)
                          <div className="w-full h-full flex flex-col">
                              <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-3">
                                  <span className="text-2xl">{activePage.icon}</span>
                                  {editingEmbedName ? (
                                      <input 
                                          className="font-semibold text-gray-700 outline-none border-b-2 border-blue-400 bg-transparent"
                                          value={activePage.name}
                                          onChange={(e) => {
                                              setData(prev => ({
                                                  ...prev,
                                                  notebooks: prev.notebooks.map(nb => 
                                                      nb.id !== activeNotebookId ? nb : {
                                                          ...nb,
                                                          tabs: nb.tabs.map(tab => 
                                                              tab.id !== activeTabId ? tab : {
                                                                  ...tab,
                                                                  pages: tab.pages.map(p => 
                                                                      p.id !== activePage.id ? p : { ...p, name: e.target.value }
                                                                  )
                                                              }
                                                          )
                                                      }
                                                  )
                                              }));
                                          }}
                                          onBlur={() => setEditingEmbedName(false)}
                                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') setEditingEmbedName(false); }}
                                          autoFocus
                                      />
                                  ) : (
                                      <span 
                                          className="font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                                          onClick={() => setEditingEmbedName(true)}
                                          title="Click to edit name"
                                      >
                                          {activePage.name}
                                      </span>
                                  )}
                                  <button 
                                      onClick={openEditEmbed}
                                      className="p-1.5 hover:bg-gray-100 rounded transition-colors text-gray-400 hover:text-gray-600"
                                      title="Edit page settings"
                                  >
                                      <Edit3 size={16} />
                                  </button>
                                  <button 
                                      onClick={() => toggleStar(activePage.id, activeNotebookId, activeTabId)}
                                      className={`p-1.5 rounded transition-colors ${activePage.starred ? 'text-yellow-400 hover:bg-yellow-50' : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-100'}`}
                                      title={activePage.starred ? 'Remove from favorites' : 'Add to favorites'}
                                  >
                                      <Star size={16} filled={activePage.starred} />
                                  </button>
                                  <span className="text-xs text-gray-400 ml-auto">
                                      {activePage.type === 'doc' ? 'Google Docs' : 
                                       activePage.type === 'sheet' ? 'Google Sheets' : 
                                       activePage.type === 'slide' ? 'Google Slides' :
                                       activePage.type === 'web' ? 'Web Page' :
                                       activePage.type === 'pdf' ? 'PDF Document' : 'Embed'}
                                  </span>
                              </div>
                              <iframe 
                                  src={activePage.embedUrl}
                                  className="flex-1 w-full border-0"
                                  allow="autoplay"
                              />
                          </div>
                      ) : (
                      // Regular block page
                      <div className="max-w-4xl mx-auto min-h-[500px] bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden pb-10">
                          {activePage.cover && <div className="h-40 w-full bg-gray-100 group relative">
                              {activePage.cover.startsWith('color:') ? (
                                  <div className={`w-full h-full bg-${activePage.cover.replace('color:', '')}-400`} />
                              ) : activePage.cover.startsWith('gradient:') ? (
                                  <div className="w-full h-full" style={{ background: activePage.cover.replace('gradient:', '') }} />
                              ) : (
                                  <img src={activePage.cover} className="w-full h-full object-cover" />
                              )}
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                  <button onClick={() => setShowCoverInput(true)} className="bg-white/80 hover:bg-white text-xs px-2 py-1 rounded shadow-sm text-gray-700 cover-input-trigger">Change Cover</button>
                                  <button onClick={() => updatePageMeta({ cover: null })} className="bg-white/80 hover:bg-white text-xs px-2 py-1 rounded shadow-sm text-red-600">Remove</button>
                              </div>
                          </div>}
                          <div className={`p-8 ${activePage.cover ? 'pt-2' : ''}`}>
                              {!activePage.cover && <div className="w-full flex justify-center opacity-0 hover:opacity-100 mb-2 transition-opacity"><button onClick={() => setShowCoverInput(true)} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"><ImageIcon size={12}/> Add Cover</button></div>}
                              
                              {showCoverInput && (
                                  <div className="absolute top-20 right-1/2 translate-x-1/2 z-50 bg-white p-3 rounded-lg shadow-xl border border-gray-200 w-72 cover-input animate-fade-in">
                                      <div className="text-xs font-semibold text-gray-500 mb-2">Image URL</div>
                                      <input 
                                          className="w-full text-xs p-2 border rounded mb-3" 
                                          placeholder="Paste image URL..." 
                                          autoFocus
                                          onKeyDown={(e) => {
                                              if (e.key === 'Enter' && e.target.value) {
                                                  updatePageMeta({ cover: e.target.value });
                                                  setShowCoverInput(false);
                                              }
                                          }}
                                      />
                                      <div className="text-xs font-semibold text-gray-500 mb-2">Solid Colors</div>
                                      <div className="grid grid-cols-6 gap-2 mb-3">
                                          {['gray', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'teal', 'cyan', 'blue', 'indigo', 'purple'].map(color => (
                                              <div 
                                                  key={color}
                                                  onClick={() => { updatePageMeta({ cover: `color:${color}` }); setShowCoverInput(false); }}
                                                  className={`w-8 h-8 rounded cursor-pointer hover:scale-110 transition-transform shadow-sm bg-${color}-400`}
                                              />
                                          ))}
                                      </div>
                                      <div className="text-xs font-semibold text-gray-500 mb-2">Gradients</div>
                                      <div className="grid grid-cols-4 gap-2">
                                          {[
                                              'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                              'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                              'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                              'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                                              'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                                              'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                                              'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                                              'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                          ].map((gradient, i) => (
                                              <div 
                                                  key={i}
                                                  onClick={() => { updatePageMeta({ cover: `gradient:${gradient}` }); setShowCoverInput(false); }}
                                                  className="w-full h-8 rounded cursor-pointer hover:scale-105 transition-transform shadow-sm"
                                                  style={{ background: gradient }}
                                              />
                                          ))}
                                      </div>
                                  </div>
                              )}

                              <div className="flex items-end -mt-10 mb-4 ml-4 gap-2">
                                  <button 
                                      onClick={() => toggleStar(activePage.id, activeNotebookId, activeTabId)} 
                                      className={`p-2 rounded-lg transition-colors ${activePage.starred ? 'text-yellow-400 hover:bg-yellow-50' : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-100'}`}
                                      title={activePage.starred ? 'Remove from favorites' : 'Add to favorites'}
                                  >
                                      <Star size={24} filled={activePage.starred} />
                                  </button>
                                  <div className="relative inline-block">
                                      <div 
                                          className="text-6xl drop-shadow-sm select-none cursor-pointer hover:bg-gray-100/50 rounded p-2 transition-colors icon-picker-trigger"
                                          onClick={() => setShowIconPicker(!showIconPicker)}
                                      >
                                          {activePage.icon || '📄'}
                                      </div>
                                      {showIconPicker && (
                                          <div className="absolute top-full left-0 z-50 bg-white border border-gray-200 shadow-xl rounded-lg p-2 w-64 h-64 overflow-y-auto icon-picker animate-fade-in">
                                              <div className="grid grid-cols-5 gap-1">
                                                  {EMOJIS.map(emoji => (
                                                      <div key={emoji} className="text-2xl cursor-pointer hover:bg-gray-100 p-1 rounded text-center" onClick={() => { updatePageMeta({ icon: emoji }); setShowIconPicker(false); }}>{emoji}</div>
                                                  ))}
                                              </div>
                                          </div>
                                      )}
                                  </div>
                              </div>

                              <div className="mb-8 border-b border-gray-100 pb-4">
                                   <div className="flex items-start gap-3">
                                       <input ref={titleInputRef} className="text-4xl font-bold flex-1 outline-none placeholder-gray-300 py-3 leading-normal" value={activePage.name} onChange={(e) => renameItem('page', activePage.id, e.target.value)} onClick={(e) => e.target.select()} onKeyDown={handleTitleKeyDown} />
                                   </div>
                                   <div className="text-gray-400 text-xs mt-2 flex gap-4">
                                      <span>Created: Today {new Date(activePage.createdAt).toLocaleDateString()} {new Date(activePage.createdAt).toLocaleTimeString()} • {activePage.rows.reduce((acc, r) => acc + r.columns.reduce((ac, c) => ac + c.blocks.length, 0), 0)} blocks</span>
                                   </div>
                              </div>
                              <div 
                                  className="space-y-2"
                                  onDragOver={(e) => e.preventDefault()}
                                  onDrop={handleDrop}
                                  onDragEnd={() => { setDraggedBlock(null); setDropTarget(null); }}
                              >
                                  {activePage.rows.map((row) => (
                                      <div key={row.id} className="flex gap-4 group/row relative">
                                          {row.columns.map((col) => (
                                              <div key={col.id} className="flex-1 min-w-[50px] space-y-2">
                                                  {col.blocks.map((block) => (
                                                      <BlockComponent 
                                                          key={block.id} block={block} rowId={row.id} colId={col.id}
                                                          onUpdate={(updates) => updateBlock(block.id, updates)}
                                                          onDelete={() => removeBlock(block.id)}
                                                          onInsertBelow={(type) => insertBlockAfter(block.id, type)}
                                                          autoFocusId={autoFocusId}
                                                          onRequestFocus={() => setAutoFocusId(block.id)}
                                                          isSelected={selectedBlockId === block.id}
                                                          onHandleClick={(e) => handleBlockHandleClick(e, block.id)}
                                                          onFocus={() => { setSelectedBlockId(null); setBlockMenu(null); setAutoFocusId(null); }}
                                                          onDragStart={(e) => { e.dataTransfer.setData('block_drag', JSON.stringify({ block, rowId: row.id, colId: col.id })); setDraggedBlock({ block, rowId: row.id, colId: col.id }); }}
                                                          onDragOver={(e) => {
                                                              e.preventDefault(); e.stopPropagation();
                                                              if (!draggedBlock || draggedBlock.block.id === block.id) return;
                                                              const rect = e.currentTarget.getBoundingClientRect();
                                                              const x = e.clientX - rect.left; const y = e.clientY - rect.top;
                                                              const w = rect.width; const h = rect.height;
                                                              let position = 'bottom';
                                                              
                                                              const dLeft = x; const dRight = w - x; const dTop = y; const dBottom = h - y;
                                                              let minD = dBottom; // Default strict bottom
                                                              
                                                              // More balanced sticky logic
                                                              if (dTop < h * 0.3) { minD = dTop; position = 'top'; }

                                                              const targetRow = activePage.rows.find(r => r.id === row.id);
                                                              const isMaxColumns = targetRow && targetRow.columns.length >= settings.maxColumns;
                                                              
                                                              if (!isMaxColumns) {
                                                                  if (x < w * 0.2) position = 'left';
                                                                  else if (x > w * 0.8) position = 'right';
                                                              }

                                                              setDropTarget({ rowId: row.id, colId: col.id, blockId: block.id, position });
                                                          }}
                                                          onDrop={handleDrop} dropTarget={dropTarget}
                                                      />
                                                  ))}
                                              </div>
                                          ))}
                                      </div>
                                  ))}
                              </div>
                              
                              {/* Clickable area to add new block */}
                              <div 
                                  className="mt-4 p-2 rounded cursor-text group"
                                  onClick={() => addBlock('text')}
                              >
                                  <div className="text-gray-300 group-hover:text-gray-400 transition-colors pl-6">
                                      Type '/' for commands
                                  </div>
                              </div>
                              
                              <div className="mt-12 pb-20 opacity-30 hover:opacity-50 transition-opacity">
                                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-400">
                                    {[
                                        { cmd: '/h1', desc: 'heading' },
                                        { cmd: '/h2', desc: 'subheading' },
                                        { cmd: '/ul', desc: 'bullets' },
                                        { cmd: '/ol', desc: 'numbers' },
                                        { cmd: '/todo', desc: 'checkbox' },
                                        { cmd: '/img', desc: 'image' },
                                        { cmd: '/vid', desc: 'video' },
                                        { cmd: '/link', desc: 'link' },
                                        { cmd: '/div', desc: 'divider' },
                                    ].map(c => (
                                        <span key={c.cmd} className="whitespace-nowrap">
                                            <span className="font-mono font-medium">{c.cmd}</span>
                                            <span className="text-gray-300 ml-1">{c.desc}</span>
                                        </span>
                                    ))}
                                </div>
                            </div>
                          </div>
                      </div>
                      )
                  ) : ( <div className="flex h-full items-center justify-center text-gray-400">Select a page</div> )}
              </div>

              {/* PAGES LIST */}
              {activeTab && (
                  <div className={`${settings.condensedView ? 'w-14' : 'w-56'} border-l border-gray-200 bg-white flex flex-col shadow-inner transition-all duration-200`}>
                      <div className={`p-3 border-b bg-gray-50 flex ${settings.condensedView ? 'justify-center' : 'justify-between'} items-center relative`}>
                          {!settings.condensedView && <span className="font-semibold text-gray-600 text-xs uppercase tracking-wider">Pages</span>}
                          <div className="relative">
                              <button onClick={() => setShowPageTypeMenu(!showPageTypeMenu)} className="hover:bg-gray-200 p-1 rounded transition-colors page-type-trigger" title="Add page"><Plus size={16} /></button>
                              {showPageTypeMenu && (
                                  <div className="page-type-menu absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 w-48 animate-fade-in">
                                      <button onClick={() => { addPage(); setShowPageTypeMenu(false); }} className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm">
                                          <span className="text-lg">📝</span> Block Page
                                      </button>
                                      <div className="border-t border-gray-100 my-1"></div>
                                      <button onClick={() => { setGoogleImportType('doc'); setShowGoogleImport(true); setShowPageTypeMenu(false); }} className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm">
                                          <span className="text-lg">📄</span> Google Doc
                                      </button>
                                      <button onClick={() => { setGoogleImportType('sheet'); setShowGoogleImport(true); setShowPageTypeMenu(false); }} className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm">
                                          <span className="text-lg">📊</span> Google Sheet
                                      </button>
                                      <button onClick={() => { setGoogleImportType('slide'); setShowGoogleImport(true); setShowPageTypeMenu(false); }} className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm">
                                          <span className="text-lg">📽️</span> Google Slides
                                      </button>
                                      <div className="border-t border-gray-100 my-1"></div>
                                      <button onClick={() => { setUrlImportType('web'); setShowUrlImport(true); setShowPageTypeMenu(false); }} className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm">
                                          <span className="text-lg">🌐</span> Web Page
                                      </button>
                                      <button onClick={() => { setUrlImportType('pdf'); setShowUrlImport(true); setShowPageTypeMenu(false); }} className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm">
                                          <span className="text-lg">📑</span> PDF Document
                                      </button>
                                  </div>
                              )}
                          </div>
                      </div>
                      <div className="flex-1 overflow-y-auto">
                          {activeTab.pages.map((page, index) => (
                              <div key={page.id} id={`nav-page-${page.id}`} tabIndex={0} onKeyDown={(e) => handlePageKeyDown(e, page.id, index, activeTab.pages)}
                                  draggable={!editingPageId} onDragStart={(e) => handleNavDragStart(e, 'page', page.id, index)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleNavDrop(e, 'page', index)}
                                  className={`page-item group flex items-center ${settings.condensedView ? 'justify-center' : 'gap-2'} p-3 border-b cursor-pointer text-sm outline-none transition-all ${activePageId === page.id ? 'bg-gray-100 border-l-4 border-l-blue-500' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`}
                                  onClick={() => { if (activePageId === page.id) return; selectPage(page.id); }}
                                  title={settings.condensedView ? page.name : undefined}>
                                  <span className={settings.condensedView ? 'text-xl' : 'mr-1'}>{page.icon || '📄'}</span>
                                  {!settings.condensedView && (activePageId === page.id && editingPageId === page.id ? (
                                      <input className="flex-1 bg-transparent outline-none page-input" value={page.name} onChange={(e) => renameItem('page', page.id, e.target.value)} onFocus={(e) => e.target.select()} onBlur={() => setEditingPageId(null)} onKeyDown={(e) => e.stopPropagation()} autoFocus />
                                  ) : ( 
                                      <div className="flex-1 truncate" onClick={(e) => { if(activePageId === page.id) { e.stopPropagation(); setEditingPageId(page.id); } }}>{page.name}</div> 
                                  ))}
                                  {!settings.condensedView && (
                                    <div className="flex items-center gap-1">
                                      <button onClick={(e) => { e.stopPropagation(); toggleStar(page.id, activeNotebookId, activeTabId); }} className={`${page.starred ? 'text-yellow-400' : 'opacity-0 group-hover:opacity-100 text-gray-400 hover:text-yellow-400'} transition-all`} title={page.starred ? 'Remove from favorites' : 'Add to favorites'}>
                                        <Star size={14} filled={page.starred} />
                                      </button>
                                      <button onClick={(e) => { e.stopPropagation(); executeDelete('page', page.id); }} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"><X size={14} /></button>
                                    </div>
                                  )}
                              </div>
                          ))}
                      </div>
                  </div>
              )}
          </div>
          
          {activeTabMenu && (
              <div className="fixed bg-white border border-gray-200 shadow-xl rounded-lg p-3 z-[9999] tab-settings-menu animate-fade-in" style={{ top: activeTabMenu.top, left: activeTabMenu.left }}>
                  <div className="text-[10px] font-bold text-gray-400 uppercase mb-2">Section Color</div>
                  <div className="grid grid-cols-5 gap-2 mb-3">
                      {COLORS.map(c => ( <div key={c.name} onClick={() => updateTabColor(activeTabMenu.id, c.name)} className={`w-5 h-5 rounded-full cursor-pointer bg-${c.name}-500 hover:scale-125 transition-transform shadow-sm`}></div> ))}
                  </div>
                  <div className="border-t border-gray-100 my-2"></div>
                  <button onClick={() => executeDelete('tab', activeTabMenu.id)} className="w-full text-left text-xs text-red-600 p-1.5 hover:bg-red-50 rounded flex items-center gap-2 transition-colors"><Trash2 size={12}/> Delete Section</button>
              </div>
          )}

          {blockMenu && (
              <div className="fixed bg-white border border-gray-200 shadow-xl rounded-lg p-2 z-[9999] block-menu animate-fade-in" style={{ top: blockMenu.top, left: blockMenu.left }}>
                  <div className="grid grid-cols-5 gap-2">
                      <div onClick={() => updateBlockColor(blockMenu.id, null)} className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100"><X size={10}/></div>
                      {COLORS.map(c => ( <div key={c.name} onClick={() => updateBlockColor(blockMenu.id, c.name)} className={`w-5 h-5 rounded-full cursor-pointer bg-${c.name}-500 hover:scale-125 transition-transform shadow-sm`}></div> ))}
                  </div>
              </div>
          )}

          {notebookIconPicker && (
              <div className="fixed bg-white border border-gray-200 shadow-xl rounded-lg p-2 z-[9999] notebook-icon-picker animate-fade-in w-64 h-64 overflow-y-auto" style={{ top: notebookIconPicker.top, left: notebookIconPicker.left }}>
                  <div className="grid grid-cols-5 gap-1">
                      {EMOJIS.slice(0, 200).map((emoji, i) => (
                          <div key={i} className="text-xl cursor-pointer hover:bg-gray-100 p-1 rounded text-center" onClick={() => updateNotebookIcon(notebookIconPicker.id, emoji)}>{emoji}</div>
                      ))}
                  </div>
              </div>
          )}

          {tabIconPicker && (
              <div className="fixed bg-white border border-gray-200 shadow-xl rounded-lg p-2 z-[9999] tab-icon-picker animate-fade-in w-64 h-64 overflow-y-auto" style={{ top: tabIconPicker.top, left: tabIconPicker.left }}>
                  <div className="grid grid-cols-5 gap-1">
                      {EMOJIS.slice(0, 200).map((emoji, i) => (
                          <div key={i} className="text-xl cursor-pointer hover:bg-gray-100 p-1 rounded text-center" onClick={() => updateTabIcon(tabIconPicker.id, emoji)}>{emoji}</div>
                      ))}
                  </div>
              </div>
          )}

          {notification && <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg z-[10000] animate-bounce-in">{notification.message}</div>}

          {showGoogleImport && (
              <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4 backdrop-blur-sm">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
                      <div className="flex items-center justify-between mb-6">
                          <h3 className="font-bold text-xl flex items-center gap-3 dark:text-white">
                              <GoogleG size={24} /> Add Google Workspace Page
                          </h3>
                          <button onClick={() => { setShowGoogleImport(false); setGoogleImportUrl(''); }} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                              <X size={20} className="dark:text-white" />
                          </button>
                      </div>
                      
                      {/* Type Selection */}
                      <div className="mb-4">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Type</label>
                          <div className="flex gap-2">
                              {[
                                  { value: 'doc', icon: '📄', label: 'Doc' },
                                  { value: 'sheet', icon: '📊', label: 'Sheet' },
                                  { value: 'slide', icon: '📽️', label: 'Slides' },
                              ].map(opt => (
                                  <button
                                      key={opt.value}
                                      onClick={() => setGoogleImportType(opt.value)}
                                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-lg border-2 transition-all ${
                                          googleImportType === opt.value 
                                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
                                              : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                      }`}
                                  >
                                      <span className="text-xl">{opt.icon}</span>
                                      <span className="font-medium dark:text-white">{opt.label}</span>
                                  </button>
                              ))}
                          </div>
                      </div>

                      {/* URL Input */}
                      <div className="mb-6">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Google {googleImportType === 'doc' ? 'Docs' : googleImportType === 'sheet' ? 'Sheets' : 'Slides'} URL
                          </label>
                          <input 
                              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                              placeholder="https://docs.google.com/..."
                              value={googleImportUrl}
                              onChange={(e) => setGoogleImportUrl(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleGoogleImport(); }}
                              autoFocus
                          />
                          <p className="text-xs text-gray-400 mt-2">
                              Paste the full URL from your browser address bar. The document must be set to "Anyone with link can view".
                          </p>
                      </div>

                      <div className="flex justify-end gap-3">
                          <button 
                              onClick={() => { setShowGoogleImport(false); setGoogleImportUrl(''); }}
                              className="px-5 py-2 font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                              Cancel
                          </button>
                          <button 
                              onClick={handleGoogleImport}
                              disabled={!googleImportUrl}
                              className="px-5 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                              Add Page
                          </button>
                      </div>
                  </div>
              </div>
          )}

          {showUrlImport && (
              <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4 backdrop-blur-sm">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
                      <div className="flex items-center justify-between mb-6">
                          <h3 className="font-bold text-xl flex items-center gap-3 dark:text-white">
                              <span className="text-2xl">{urlImportType === 'web' ? '🌐' : '📑'}</span>
                              Add {urlImportType === 'web' ? 'Web Page' : 'PDF Document'}
                          </h3>
                          <button onClick={() => { setShowUrlImport(false); setUrlImportValue(''); }} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                              <X size={20} className="dark:text-white" />
                          </button>
                      </div>

                      <div className="mb-6">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              {urlImportType === 'web' ? 'Website URL' : 'PDF URL'}
                          </label>
                          <input 
                              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                              placeholder={urlImportType === 'web' ? 'https://example.com' : 'https://example.com/document.pdf'}
                              value={urlImportValue}
                              onChange={(e) => setUrlImportValue(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleUrlImport(); }}
                              autoFocus
                          />
                          <p className="text-xs text-gray-400 mt-2">
                              {urlImportType === 'web' 
                                  ? 'The website will be embedded as a live view. Some sites may block embedding.' 
                                  : 'Enter a direct link to a PDF file. The PDF will be displayed using Google\'s PDF viewer.'}
                          </p>
                      </div>

                      <div className="flex justify-end gap-3">
                          <button 
                              onClick={() => { setShowUrlImport(false); setUrlImportValue(''); }}
                              className="px-5 py-2 font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                              Cancel
                          </button>
                          <button 
                              onClick={handleUrlImport}
                              disabled={!urlImportValue}
                              className="px-5 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                              Add Page
                          </button>
                      </div>
                  </div>
              </div>
          )}

          {showEditEmbed && activePage && (
              <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4 backdrop-blur-sm">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
                      <div className="flex items-center justify-between mb-6">
                          <h3 className="font-bold text-xl flex items-center gap-3 dark:text-white">
                              <Edit3 size={20} /> Edit Page
                          </h3>
                          <button onClick={() => setShowEditEmbed(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                              <X size={20} className="dark:text-white" />
                          </button>
                      </div>

                      <div className="mb-4">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Page Name</label>
                          <input 
                              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                              value={editEmbedName}
                              onChange={(e) => setEditEmbedName(e.target.value)}
                              autoFocus
                          />
                      </div>

                      {/* View Mode Toggle - Only for Google Docs/Sheets/Slides */}
                      {['doc', 'sheet', 'slide'].includes(activePage.type) && (
                          <div className="mb-4">
                              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">View Mode</label>
                              <div className="flex items-center gap-4">
                                  <button
                                      onClick={() => setEditEmbedViewMode('edit')}
                                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${editEmbedViewMode === 'edit' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                  >
                                      Edit Mode
                                  </button>
                                  <button
                                      onClick={() => setEditEmbedViewMode('preview')}
                                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${editEmbedViewMode === 'preview' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                  >
                                      Preview Mode
                                  </button>
                              </div>
                              <p className="text-xs text-gray-400 mt-2">Edit mode allows editing in the iframe. Preview mode is read-only.</p>
                          </div>
                      )}

                      <div className="mb-6">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              {activePage.type === 'doc' ? 'Google Doc URL' : 
                               activePage.type === 'sheet' ? 'Google Sheet URL' : 
                               activePage.type === 'slide' ? 'Google Slides URL' :
                               activePage.type === 'web' ? 'Web Page URL' :
                               activePage.type === 'pdf' ? 'PDF URL' : 'URL'}
                          </label>
                          <input 
                              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                              placeholder="https://..."
                              value={editEmbedUrl}
                              onChange={(e) => setEditEmbedUrl(e.target.value)}
                          />
                          <p className="text-xs text-gray-400 mt-2">
                              {['doc', 'sheet', 'slide'].includes(activePage.type) 
                                  ? 'Paste a Google Docs, Sheets, or Slides URL to update the source.'
                                  : 'Update the URL for this embedded page.'}
                          </p>
                      </div>

                      <div className="flex justify-end gap-3">
                          <button 
                              onClick={() => setShowEditEmbed(false)}
                              className="px-5 py-2 font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                              Cancel
                          </button>
                          <button 
                              onClick={handleSaveEmbed}
                              disabled={!editEmbedName}
                              className="px-5 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                              Save Changes
                          </button>
                      </div>
                  </div>
              </div>
          )}

          {itemToDelete && (
              <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4 backdrop-blur-sm">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full p-6 animate-fade-in">
                      <h3 className="font-bold text-xl mb-2 flex items-center gap-2 dark:text-white"><AlertCircle className="text-red-500" /> Confirm Deletion</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">Are you sure you want to delete this {itemToDelete.type}? All contents will be lost forever.</p>
                      <div className="flex justify-end gap-3">
                          <button onClick={() => setItemToDelete(null)} className="px-5 py-2 font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">Cancel</button>
                          <button onClick={confirmDelete} className="px-5 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors shadow-lg">Delete</button>
                      </div>
                  </div>
              </div>
          )}

          {showSettings && (
              <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4 backdrop-blur-sm">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in settings-modal">
                      <div className="flex items-center justify-between mb-6">
                          <h3 className="font-bold text-xl flex items-center gap-2 dark:text-white"><Settings size={20} /> Settings</h3>
                          <button onClick={() => setShowSettings(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><X size={20} className="dark:text-white" /></button>
                      </div>
                      
                      {/* Theme */}
                      <div className="mb-6">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Theme</label>
                          <div className="flex gap-2">
                              {[
                                  { value: 'light', icon: <Sun size={16} />, label: 'Light' },
                                  { value: 'dark', icon: <Moon size={16} />, label: 'Dark' },
                                  { value: 'system', icon: <Monitor size={16} />, label: 'System' },
                              ].map(opt => (
                                  <button
                                      key={opt.value}
                                      onClick={() => setSettings(s => ({ ...s, theme: opt.value }))}
                                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                                          settings.theme === opt.value 
                                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                                              : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                                      }`}
                                  >
                                      {opt.icon}
                                      <span className="text-sm font-medium">{opt.label}</span>
                                  </button>
                              ))}
                          </div>
                      </div>

                      {/* Max Columns */}
                      <div className="mb-6">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              <span className="flex items-center gap-2"><Columns size={16} /> Max Columns per Row</span>
                          </label>
                          <div className="flex items-center gap-3">
                              <input 
                                  type="range" 
                                  min="1" 
                                  max="6" 
                                  value={settings.maxColumns} 
                                  onChange={(e) => setSettings(s => ({ ...s, maxColumns: parseInt(e.target.value) }))}
                                  className="flex-1 accent-blue-500"
                              />
                              <span className="w-8 text-center font-bold text-lg dark:text-white">{settings.maxColumns}</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">Controls how many columns you can create when dragging blocks side-by-side</p>
                      </div>

                      {/* Condensed View */}
                      <div className="mb-6">
                          <label className="flex items-center justify-between cursor-pointer">
                              <span className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                  <Minimize2 size={16} /> Condensed View
                              </span>
                              <div 
                                  onClick={() => setSettings(s => ({ ...s, condensedView: !s.condensedView }))}
                                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${settings.condensedView ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                              >
                                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${settings.condensedView ? 'translate-x-7' : 'translate-x-1'}`}></div>
                              </div>
                          </label>
                          <p className="text-xs text-gray-400 mt-1">Shrinks sidebars and hides labels for more content space</p>
                      </div>

                      <div className="border-t dark:border-gray-700 pt-4">
                          <button 
                              onClick={() => setShowSettings(false)} 
                              className="w-full py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                          >
                              Done
                          </button>
                      </div>
                  </div>
              </div>
          )}
        </div>
      </div>
    );
  }

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App />);