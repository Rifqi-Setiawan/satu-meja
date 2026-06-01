const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'pages', 'admin');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(f => {
  const filePath = path.join(dir, f);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace import
  content = content.replace(
    /import AdminSidebar from '\.\.\/\.\.\/components\/AdminSidebar';/,
    "import AdminLayout from '../../components/AdminLayout';"
  );

  // Replace wrapper
  if (content.includes('className="flex-1 ml-64 p-8 h-screen flex flex-col"')) {
    content = content.replace(
      /<div className="min-h-screen bg-gray-50 flex">\s*<AdminSidebar \/>\s*<div className="flex-1 ml-64 p-8 h-screen flex flex-col">/,
      '<AdminLayout contentClassName="h-screen flex flex-col">'
    );
  } else {
    content = content.replace(
      /<div className="min-h-screen bg-gray-50 flex">\s*<AdminSidebar \/>\s*<div className="flex-1 ml-64 p-8">/,
      '<AdminLayout>'
    );
  }

  // Replace ending div tags
  content = content.replace(/(<\/div>\s*){2}\)\s*;\s*}\s*$/, '</AdminLayout>\n  );\n}\n');

  fs.writeFileSync(filePath, content);
  console.log('Updated ' + f);
});
