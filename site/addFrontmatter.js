const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

function addFrontmatterToContent(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const parsedContent = matter(fileContent);

  // Check if frontmatter already exists
  if (parsedContent.data.title && parsedContent.data.cip && parsedContent.data.author && parsedContent.data.status && parsedContent.data.type && parsedContent.data.created) {
    return; // If frontmatter already exists, return without writing the file
  }
  
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

  if (parsedContent.data['last-call-deadline']) {
    newContent += `**Last Call Deadline**: ${parsedContent.data['last-call-deadline']}\n\n`;
  }

  if (parsedContent.data.category) {
    newContent += `**Category**: ${parsedContent.data.category}\n\n`;
  }

  if (parsedContent.data.requires) {
    newContent += `**Requires**: ${parsedContent.data.requires}\n\n`;
  }

  if (parsedContent.data['withdrawal-reason']) {
    newContent += `**Withdrawal Reason**: ${parsedContent.data['withdrawal-reason']}\n\n`;
  }

  newContent += parsedContent.content;

  const outputFilePath = path.join('site/content', path.relative(directoryPath, filePath));
  fs.writeFileSync(outputFilePath, newContent, 'utf-8');
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