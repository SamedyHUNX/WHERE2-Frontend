import DOMPurify from 'dompurify';
import React from 'react';

export const convertToHTML = (text) => {
  if (!text) {
    return ''; // Return an empty string if text is undefined or null
  }

  // Convert headings
  text = text.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  text = text.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  text = text.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  text = text.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Convert bold and italics
  text = text.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  text = text.replace(/\*(.*?)\*/gim, '<em>$1</em>');

  // Convert links
  text = text.replace(/\[(.*?)\]\((.*?)\)/gim, '<a style="white-space: normal; word-wrap: break-word; overflow-wrap: break-word;" href="$2">$1</a>');

  // Convert plain URLs to links
  text = text.replace(/(https?:\/\/[^\s]+)/gim, '<a style="white-space: normal; word-wrap: break-word; overflow-wrap: break-word;" href="$1">$1</a>');

  // Convert social media handles to links
  text = text.replace(/@(\w+)/gim, '<a style="white-space: normal; word-wrap: break-word; overflow-wrap: break-word;" href="https://www.instagram.com/$1">@$1</a>');

  // Replace non-breaking spaces
  text = text.replace(/&nbsp;/gim, ' ');

  // Convert line breaks into <br /> tags
  text = text.replace(/\n/g, '<br />');

  // Sanitize the HTML
  const purified = DOMPurify.sanitize(text.trim());

  return <div dangerouslySetInnerHTML={{ __html: purified }} style={{ whiteSpace: 'normal', wordWrap: 'break-word', overflowWrap: 'break-word' }} />;
};
