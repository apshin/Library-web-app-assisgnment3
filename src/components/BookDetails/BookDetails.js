import React, { useState, useEffect } from 'react';
import Header from '../../Header/Header';
import './BookDetails.css';
import axios from 'axios';
import Footer from "../../Footer/Footer";
import Modal from 'react-modal'; // Import React Modal

function BookDetail({ book, handleSearchQuery }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [editedDescription, setEditedDescription] = useState(book.description);
  const [editedChapters, setEditedChapters] = useState(book.chapters);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingChapters, setIsEditingChapters] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(null); // Track selected chapter index

  const fetchChapters = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/books/${book.id}/chapters`);
      if (response.data) {
        setChapters(response.data);
      } else {
        console.error('No chapters found for the book');
      }
    } catch (error) {
      console.error('Error fetching chapters:', error);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, [book.id]);

  const handleEditDescription = () => {
    setIsEditingDescription(true);
    setIsEditingChapters(false); // Ensure only one editing mode is active
  };

  const handleEditChapters = () => {
    setIsEditingChapters(true);
    setIsEditingDescription(false); // Ensure only one editing mode is active
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/books/${book.id}`, {
        description: editedDescription,
        chapters: editedChapters
      });
      alert('Book updated successfully!');
      setIsEditingDescription(false);
      setIsEditingChapters(false);
      window.location.reload();
    } catch (error) {
      console.error('Error updating book:', error);
      alert('Failed to update book. Please try again later.');
    }
  };

  const handleCancel = () => {
    setEditedDescription(book.description);
    setEditedChapters(book.chapters);
    setIsEditingDescription(false);
    setIsEditingChapters(false);
  };

  const handleInputChange = (event) => {
    setEditedDescription(event.target.value);
  };

  const handleChapterChange = (index, event) => {
    const updatedChapters = [...editedChapters];
    updatedChapters[index][event.target.name] = event.target.value;
    setEditedChapters(updatedChapters);
  };

  const addChapter = () => {
    setEditedChapters([...editedChapters, { title: '', content: '' }]);
  };

  const removeChapter = (index) => {
    const updatedChapters = [...editedChapters];
    updatedChapters.splice(index, 1);
    setEditedChapters(updatedChapters);
  };

  const openModal = (index) => {
    setSelectedChapterIndex(index); // Set the selected chapter index
  };

  const closeModal = () => {
    setSelectedChapterIndex(null); // Reset selected chapter index to close the modal
  };

  return (
    <div div className='pdp-page'>
      <Header handleSearchQuery={handleSearchQuery} />
      <div className='container mb-4'>
        <div className="book-detail mt-5 row justify-content-center">
          <div className='col-12 col-xl-4'>
            <div className="img-container">
              <img src={book.image} alt={book.title} />
            </div>
          </div>
          <div className='col-12 col-xl-7'>
            <h2 className='text-uppercase'>{book.title}</h2>
            {isEditingDescription ? (
              <div>
                <h3 className='m-4 text-capitalize'>You are editing the book description below</h3>
                <textarea className="textarea-edit-desc" value={editedDescription} onChange={handleInputChange} />
              </div>
            ) : (
              <p><strong>Description:</strong> {book.description}</p>
            )}
            {isEditingDescription ? (
                <div>
                  <button className="button-style m-2" onClick={handleSave}>Save Description</button>
                  <button className="button-style m-2" onClick={handleCancel}>Cancel</button>
                </div>
              ) : (
                <button className="button-style" onClick={handleEditDescription}>Edit Description</button>
            )}
            </div>
            {editedChapters && editedChapters.length > 0 && (
              <div className='col-12'>
              <div>
                <h3 className='mt-4'>Chapters</h3>
                <p>Please click on the below chapters links to read the content</p>
                <ul>
                  {editedChapters.map((chapter, index) => (
                    <li key={index}>
                      {isEditingChapters && (
                        <div className='chapter-edit'>
                          <input type="text" name="title" value={chapter.title} onChange={(e) => handleChapterChange(index, e)} />
                          <textarea name="content" value={chapter.content} onChange={(e) => handleChapterChange(index, e)} />
                          <button className="button-style" onClick={() => removeChapter(index)}>Remove</button>
                        </div>
                      )}
                      {!isEditingChapters && (
                        <div>
                          <h4 onClick={() => openModal(index)} className="chapter-link">{chapter.title}</h4> {/* Add onClick event to open modal */}
                          <Modal
                            isOpen={selectedChapterIndex === index} // Open modal when selectedChapterIndex matches index
                            onRequestClose={closeModal} // Close modal when clicking outside or pressing ESC key
                            contentLabel="Chapter Content"
                          >
                            <h2 className='text-uppercase'>{chapter.title}</h2>
                            <p>{chapter.content}</p>
                            <button className="button-style" onClick={closeModal}>Close</button> {/* Button to close the modal */}
                          </Modal>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
              {isEditingChapters ? (
                <div>
                  <button className="button-style" onClick={addChapter}>Add Chapter</button>
                  <button className="button-style m-2" onClick={handleSave}>Save Chapters</button>
                  <button className="button-style m-2" onClick={handleCancel}>Cancel</button>
                </div>
              ) : (
                <button className="button-style" onClick={handleEditChapters}>Edit Chapters</button>
              )}
            </div>
            </div>
            )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default BookDetail;
