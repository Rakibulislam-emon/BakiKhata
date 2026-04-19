const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('framer-motion')) return;

    // Replace imports
    let newContent = content
        .replace(/import { motion } from "framer-motion";/g, 'import { m } from "framer-motion";')
        .replace(/import { motion } from 'framer-motion';/g, "import { m } from 'framer-motion';")
        .replace(/import { motion,/g, 'import { m,')
        .replace(/import { AnimatePresence, motion }/g, 'import { AnimatePresence, m }')
        .replace(/import { motion, useScroll, useTransform }/g, 'import { m, useScroll, useTransform }');

    // Replace JSX tags
    newContent = newContent
        .replace(/<motion\./g, '<m.')
        .replace(/<\/motion\./g, '</m.');

    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            replaceInFile(fullPath);
        }
    }
}

walkDir('src');
