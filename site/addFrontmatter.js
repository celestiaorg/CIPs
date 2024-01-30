import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

function addFrontmatterToContent(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const parsedContent = matter(fileContent);

  // Convert the Date object to a string in the yyyy-mm-dd format
  const createdDate = new Date(parsedContent.data.created);
  const createdDateString = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, '0')}-${String(createdDate.getDate()).padStart(2, '0')}`;

  // Replace the Date object with the formatted string
  parsedContent.data.created = createdDateString;

  // Check if frontmatter already exists in the markdown body and at the top of the file
  const frontmatterInBody = parsedContent.content.includes(`**CIP**: ${parsedContent.data.cip}`) &&
                            parsedContent.content.includes(`**Author**: ${parsedContent.data.author}`) &&
                            parsedContent.content.includes(`**Status**: ${parsedContent.data.status}`) &&
                            parsedContent.content.includes(`**Type**: ${parsedContent.data.type}`) &&
                            parsedContent.content.includes(`**Created**: ${parsedContent.data.created}`);
  
  const frontmatterAtTop = fileContent.startsWith(`---\ncip: ${parsedContent.data.cip}\ntitle: ${parsedContent.data.title}\nauthor: ${parsedContent.data.author}\nstatus: ${parsedContent.data.status}\ntype: ${parsedContent.data.type}\ncreated: ${parsedContent.data.created}\n---`);

  if (frontmatterInBody && frontmatterAtTop) {
    return; // If frontmatter already exists in the markdown body and at the top of the file, return without writing the file
  }

  // If frontmatter doesn't exist in the markdown body or at the top of the file, add it
  let newContent = `# ${parsedContent.data.title}\n\n`;
  newContent += `**CIP**: ${parsedContent.data.cip}\n\n`;
  newContent += `**Author**: ${parsedContent.data.author}\n\n`;
  newContent += `**Status**: ${parsedContent.data.status}\n\n`;
  newContent += `**Type**: ${parsedContent.data.type}\n\n`;
  newContent += `**Created**: ${parsedContent.data.created}\n\n`;

  if (parsedContent.data.description) {
    newContent += `**Description**: ${parsedContent.data.description}\n\n`;
  }

  if (parsedContent.data['discussions-to']) {
    newContent += `**Discussions To**: ${parsedContent.data['discussions-to']}\n\n`;
  }

  if (parsedContent.data.category) {
    newContent += `**Category**: ${parsedContent.data.category}\n\n`;
  }

  if (parsedContent.data.requires) {
    newContent += `**Requires**: ${parsedContent.data.requires}\n\n`;
  }

  newContent += parsedContent.content;

  // Preserve the original frontmatter and append the new content
  const updatedContent = matter.stringify(newContent, parsedContent.data, {
    replacer: (key, value) => {
      if (key === 'created' || key === 'last-call-deadline') {
        return value.replace(/'/g, '');
      }
      return value;
    },
  });
  fs.writeFileSync(filePath, updatedContent, 'utf-8');
}

const directoryPath = 'docs/pages/cips';

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  } 

  files.forEach((file) => {
    if (path.extname(file) === '.md') {
      addFrontmatterToContent(path.join(directoryPath, file));
    }
  });
});