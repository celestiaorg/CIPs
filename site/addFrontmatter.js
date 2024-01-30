import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

function addFrontmatterToContent(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const parsedContent = matter(fileContent);

  // Check if frontmatter already exists in the markdown body
  const frontmatterInBody = parsedContent.content.includes(`**CIP**: ${parsedContent.data.cip}`) &&
                            parsedContent.content.includes(`**Author**: ${parsedContent.data.author}`) &&
                            parsedContent.content.includes(`**Status**: ${parsedContent.data.status}`) &&
                            parsedContent.content.includes(`**Type**: ${parsedContent.data.type}`) &&
                            parsedContent.content.includes(`**Created**: ${parsedContent.data.created}`);

  if (frontmatterInBody) {
    return; // If frontmatter already exists in the markdown body, return without writing the file
  }
  
  // If frontmatter doesn't exist in the markdown body, add it
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

  fs.writeFileSync(filePath, newContent, 'utf-8');
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