import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'

// Function to generate sidebar items for CIPs
function getCIPsSidebar() {
  const cipsDir = path.resolve(__dirname, '../cips')
  let files = fs.readdirSync(cipsDir)
  
  // Sort files numerically
  files = files.sort((a, b) => {
    const numA = parseInt(a.replace('cip-', '').replace('.md', ''));
    const numB = parseInt(b.replace('cip-', '').replace('.md', ''));
    return numA - numB;
  });

  return files.map(file => {
    const name = path.basename(file, '.md')
    return { text: name, link: `/cips/${name}` }
  })
}

export default defineConfig({
  title: "CIPs",
  description: "Celestia Improvement Proposals",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
    ],
    sidebar: {
      '/': getCIPsSidebar().concat([
      ])
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/celestiaorg/cips' }
    ]
  }
})