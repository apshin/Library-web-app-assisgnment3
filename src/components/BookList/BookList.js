import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../../Header/Header';
import './BookList.css';
import { Modal, Button, Pagination, Form } from 'react-bootstrap';
import NavBar from '../../Header/NavBar';
import HeroBanner from '../SearchBar/HeroBanner';
import "../../index.css";
import Footer from '../../Footer/Footer';

function BookList({ userData, loggedIn, guestMode, handleGuestMode, setLoggedIn, setGuestMode, loggedInUser }) {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [show, setShow] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [username, setUsername] = useState('');
    const [newBook, setNewBook] = useState({
        title: '',
        author: '',
        image: '',
        description: '',
        visibility: 'public',
        chapters: []
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(10);
    const [showAddBookModal, setShowAddBookModal] = useState(false);
    const [showAddChaptersModal, setShowAddChaptersModal] = useState(false);
    const [numChapters, setNumChapters] = useState('');
    const [chapterInputs, setChapterInputs] = useState([]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                let params = {};
                if (guestMode) {
                    // Guest mode: Fetch both public books from the database and books from the Google Books API
                    const responseFromDB = await axios.get('http://localhost:5000/api/books');
                    const booksFromDB = responseFromDB.data;

                    const responseFromGoogle = await axios.get("https://www.googleapis.com/books/v1/volumes?q=programming&maxResults=40");
                    const bookItems = responseFromGoogle.data.items;
                    const formattedBooks = bookItems.map(item => ({
                        title: item.volumeInfo.title,
                        authors: item.volumeInfo.authors,
                        image: item.volumeInfo.imageLinks?.thumbnail,
                        description: item.volumeInfo.description || 'No description available',
                        visibility: 'public'
                    }));

                    setBooks([...booksFromDB, ...formattedBooks]);
                } else if (loggedInUser && loggedInUser.userId) {
                    // Logged-in mode: Fetch books from the database based on the user's ID
                    params.userId = loggedInUser.userId;
                    const responseFromDB = await axios.get('http://localhost:5000/api/books', {
                        params: params
                    });
                    const booksFromDB = responseFromDB.data;
                    setBooks(booksFromDB);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching books:', error);
                setLoading(false);
            }
        };

        fetchBooks();
    }, [loggedInUser, loggedIn, guestMode]);


    const handleSearchQuery = (query) => {
        setSearchQuery(query);
    };

    // Add a New Book
    const handleAddBook = async (event) => {
        event.preventDefault();

        if (!loggedInUser || !loggedInUser.userId) {
            console.error('User information not available.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/api/books', { ...newBook, userId: loggedInUser.userId });
            console.log(response.data);
            setNewBook({
                title: '',
                author: '',
                image: '',
                description: '',
                visibility: 'public',
                chapters: []
            });
            setShowAddBookModal(false);
            // Refetch books from the database with sorting to ensure the newest books appear first
            const responseFromDB = await axios.get('http://localhost:5000/api/books', {
                params: { sortBy: 'createdAt', order: 'desc' }
            });
            const booksFromDB = responseFromDB.data;
            setBooks(booksFromDB);
        } catch (error) {
            console.error('Error adding book:', error.response.data);
        }
    };

    const handleAddChapters = () => {
        setShowAddChaptersModal(true);
    };


    const handleBookClick = (book) => {
        setSelectedBook(book);
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (book.visibility === 'public' || (loggedIn && book.visibility === 'private'))
    );

    const clearBooksFromLocalStorage = () => {
        localStorage.removeItem('books');
        setBooks([]);
    };
    const handleLogout = () => {
        setUsername('');
        setLoggedIn(false);
        setGuestMode(false);
        localStorage.removeItem('user');
    };


    const handleChapterTitleChange = (index, e) => {
        const newChapterInputs = [...chapterInputs];
        newChapterInputs[index] = { ...newChapterInputs[index], title: e.target.value };
        setChapterInputs(newChapterInputs);
    };

    const handleChapterContentChange = (index, e) => {
        const newChapterInputs = [...chapterInputs];
        newChapterInputs[index] = { ...newChapterInputs[index], content: e.target.value };
        setChapterInputs(newChapterInputs);
    };

    const addChapter = () => {
        const updatedChapters = chapterInputs.slice(0, numChapters).filter(chapter => chapter.title.trim() !== '' && chapter.content.trim() !== '');
        if (updatedChapters.length > 0) {
            setNewBook({
                ...newBook,
                chapters: [...newBook.chapters, ...updatedChapters]
            });
            setChapterInputs([]);
            setNumChapters('');
            setShowAddChaptersModal(false);
            alert(`${numChapters} chapters added.`);
        }
    };

    // Get current books
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='book-list'>
            <Header handleSearchQuery={handleSearchQuery} />
            <NavBar />
            <HeroBanner />
            <div className='booklist'>
                <h1 className='text-center mt-4 mb-4'>Book List</h1>
                {loggedIn && (
                    <Button className="addnew-btn button-style d-flex" onClick={() => setShowAddBookModal(true)}>Add New Book</Button>
                )}
                {!loggedIn && (
                    <div className="login-prompt text-center mb-3">
                        <p className='fs-5'>Please login to add a new book.</p>
                        <Button className="login-btn button-style" onClick={handleLogout}>Login</Button>
                    </div>
                )}
                <Modal show={showAddBookModal} onHide={() => setShowAddBookModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Adding New Book</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="new-book-form">
                            <h2>Add New Book</h2>
                            {loggedIn && (
                                <Form onSubmit={handleAddBook}>
                                    <Form.Group controlId="formTitle">
                                        <Form.Label>Title</Form.Label>
                                        <Form.Control type="text" placeholder="Enter title" value={newBook.title} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} />
                                    </Form.Group>
                                    <Form.Group controlId="formAuthor">
                                        <Form.Label>Author</Form.Label>
                                        <Form.Control type="text" placeholder="Enter author" value={newBook.author} onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} />
                                    </Form.Group>
                                    <Form.Group controlId="formImage">
                                        <Form.Label>Image URL</Form.Label>
                                        <Form.Control type="text" placeholder="Enter image URL" value={newBook.image} onChange={(e) => setNewBook({ ...newBook, image: e.target.value })} />
                                    </Form.Group>
                                    <Form.Group controlId="formDescription">
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control as="textarea" rows={3} placeholder="Enter description" value={newBook.description} onChange={(e) => setNewBook({ ...newBook, description: e.target.value })} />
                                    </Form.Group>
                                    <Form.Group controlId="formVisibility">
                                        <Form.Label>Visibility</Form.Label>
                                        <div className='mb-3'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Public"
                                                name="visibility"
                                                value="public"
                                                checked={newBook.visibility === 'public'}
                                                onChange={(e) => setNewBook({ ...newBook, visibility: e.target.value })}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Private"
                                                name="visibility"
                                                value="private"
                                                checked={newBook.visibility === 'private'}
                                                onChange={(e) => setNewBook({ ...newBook, visibility: e.target.value })}
                                            />
                                        </div>
                                    </Form.Group>
                                    <Button className="button-style" variant="primary" type="submit">
                                        Add Book
                                    </Button>
                                </Form>
                            )}
                            <Button variant="secondary" className="button-style mt-3" onClick={() => setShowAddBookModal(false)}>Close</Button>
                            <Button variant="primary" className="button-style mt-3 mx-2" onClick={handleAddChapters}>Add Chapters</Button>
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal className="chapter-form" show={showAddChaptersModal} onHide={() => setShowAddChaptersModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Chapters</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h2>Add Chapters</h2>
                        <Form.Group controlId="formNumChapters">
                            <Form.Label>Number of Chapters</Form.Label>
                            <Form.Control type="number" min="1" placeholder="Please enter the number of chapters" value={numChapters} onChange={(e) => setNumChapters(parseInt(e.target.value))} />
                        </Form.Group>
                        {/* Render input fields for chapter titles and content based on numChapters */}
                        {[...Array(numChapters)].map((_, index) => (
                            <div key={index}>
                                <Form.Group controlId={`formChapterTitle${index + 1}`}>
                                    <Form.Label>Chapter {index + 1} Title</Form.Label>
                                    <Form.Control type="text" placeholder={`Enter title for Chapter ${index + 1}`} value={chapterInputs[index]?.title || ''} onChange={(e) => handleChapterTitleChange(index, e)} />
                                </Form.Group>
                                <Form.Group controlId={`formChapterContent${index + 1}`}>
                                    <Form.Label>Chapter {index + 1} Content</Form.Label>
                                    <Form.Control as="textarea" rows={3} placeholder={`Enter content for Chapter ${index + 1}`} value={chapterInputs[index]?.content || ''} onChange={(e) => handleChapterContentChange(index, e)} />
                                </Form.Group>
                            </div>
                        ))}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" className="button-style" onClick={() => setShowAddChaptersModal(false)}>Cancel</Button>
                        <Button variant="primary" className="button-style" onClick={addChapter}>Confirm</Button>
                    </Modal.Footer>
                </Modal>
                {!loading && (
                    <div className='container '>
                        <div className='row'>
                            {currentBooks.map((book, index) => (
                                <div className='col-12 col-md-4 col-xl-3' key={index}>
                                    <Link to={`/book/${encodeURIComponent(book.title)}`}>
                                        <div className='book-item' onClick={() => handleBookClick(book)}>
                                            {book.cover_id && (
                                                <img className='book-img' src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`} alt={book.title} />
                                            )}
                                            {book.image && (
                                                <img className='book-img' src={book.image} alt={book.title} />
                                            )}
                                            <div className='book-details'>
                                                <h3 className='book-title'>{book.title}</h3>
                                                {book.authors && (
                                                    <p className='book-para'><strong>Author:</strong> {book.authors.join(", ")}</p>
                                                )}
                                                {book.author && (<p><strong>Author:</strong> {book.author}</p>)}
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                        <Pagination>
                            {filteredBooks.length > booksPerPage && (
                                Array.from({ length: Math.ceil(filteredBooks.length / booksPerPage) }, (_, index) => (
                                    <Pagination.Item key={index + 1} onClick={() => paginate(index + 1)} active={index + 1 === currentPage}>
                                        {index + 1}
                                    </Pagination.Item>
                                ))
                            )}
                        </Pagination>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default BookList;
