const fs = require('fs');
const path = require('path');
const axios = require('axios');
const markdown = require('markdown-it')();

// Define the base URL for your Express server API
const apiUrl = 'http://localhost:3000/books';

// Function to retrieve all books and return their IDs
async function getAllBookIds() {
  try {
    const response = await axios.get(apiUrl);
    // Assuming the response data is an array of books
    return response.data.map(book => book._id);
  } catch (error) {
    console.error('Error retrieving books:', error);
    return [];
  }
}

// Function to delete a book by its ID
async function deleteBookById(bookId) {
  try {
    await axios.delete(`${apiUrl}/${bookId}`);
    console.log(`Book deleted: ${bookId}`);
  } catch (error) {
    console.error(`Error deleting book ${bookId}:`, error);
  }
}

// Function to create a book from a directory
async function createBookFromDirectory(bookDir) {
  const bookPath = path.join(bookDir);
  const pages = [];
  let bookMetadata = {
    title: '',
    author: '',
    publicationDate: '',
    url: ''
  };

  // Read the readme.md file for metadata
  const readmeContent = fs.readFileSync(path.join(bookPath, 'readme.md'), 'utf-8');
  const readmeHtml = markdown.render(readmeContent);

  // Extract metadata from the HTML content of the readme
  const urlMatch = readmeHtml.match(/URL: (.*)/);
  const titleMatch = readmeHtml.match(/Title: (.*)/);
  const authorMatch = readmeHtml.match(/Author: (.*)/);
  const releaseMatch = readmeHtml.match(/Release: (.*)/);

  if (urlMatch) bookMetadata.url = urlMatch[1];
  if (titleMatch) bookMetadata.title = titleMatch[1];
  if (authorMatch) bookMetadata.author = authorMatch[1];
  if (releaseMatch) {
    const releaseDate = releaseMatch[1].replace(/<\/?[^>]+(>|$)/g, "").trim(); 
    bookMetadata.publicationDate = new Date(releaseDate);
  }

  // Read all .txt files as pages
  fs.readdirSync(bookPath).forEach(file => {
    if (file === '.DS_Store' || path.extname(file) === '.epub') return;
    if (path.extname(file) === '.txt') {
      const pageNumber = parseInt(file.split('.')[0], 10);
      const content = fs.readFileSync(path.join(bookPath, file), 'utf-8');
      pages.push({ pageNumber, content });
    }
  });

  // Sort pages by page number
  pages.sort((a, b) => a.pageNumber - b.pageNumber);

  // Create a book object with metadata and pages
  const book = {
    ...bookMetadata,
    pages
  };

  // Send a request to add the book
  try {
    const response = await axios.post(apiUrl, book);
    console.log(`Book added: ${response.data.title}`);
  } catch (error) {
    console.error(`Error adding book:`, error);
  }
}

// Main script to delete existing books and create a new one from the ebook directory
async function main() {
  // Retrieve and delete all existing books
  const bookIds = await getAllBookIds();
  for (const bookId of bookIds) {
    await deleteBookById(bookId);
  }

  // Path to the ebook directory
  const ebookDir = './ebook';
  // Create a book from the first non-.DS_Store directory in the ebook directory
  const bookDirs = fs.readdirSync(ebookDir).filter(bookDir => bookDir !== '.DS_Store');
  if (bookDirs.length > 0) {
    await createBookFromDirectory(path.join(ebookDir, bookDirs[0]));
  } else {
    console.log('No book directories found.');
  }
}

main();