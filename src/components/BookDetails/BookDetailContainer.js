import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BookDetail from './BookDetails';

function BookDetailContainer() {
  const [book, setBook] = useState(null);
  const [editedBook, setEditedBook] = useState(null);
  const { title } = useParams();
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    const fetchBookDetails = async () => {
           try {
        const response = await axios.get(`http://localhost:5000/api/books/${title}`);
        console.log(response.data);
        if (response.data) {
          setBook(response.data);
          setEditedBook(response.data);
          setChapters(response.data.chapters || []);
        } else {
          console.error('No book found with the given title');
        }
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    };

    fetchBookDetails();
  }, [title]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedBook({ ...editedBook, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Make an API call to update the book in the database
      await axios.put(`http://localhost:5000/api/books/${book.id}`, editedBook);
      alert('Book updated successfully!');
      // Update the book state with the edited book details
      setBook(editedBook);
    } catch (error) {
      console.error('Error updating book:', error);
      alert('Failed to update book. Please try again later.');
    }
  };

  return (
    <div>
    {book ? (
      <BookDetail book={book} chapters={chapters} editedBook={editedBook} handleInputChange={handleInputChange} handleSubmit={handleSubmit} />
    ) : (
      <div>Loading...</div>
    )}
  </div>
  );
}

export default BookDetailContainer;
