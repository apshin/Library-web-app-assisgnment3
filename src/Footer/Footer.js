import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="row">
          <div className="col-md-4 footer-items">
            <h4>About Us</h4>
            <p>Welcome to our library! We are passionate about books and aim to provide a wide range of reading materials to our community.</p>
          </div>
          <div className="col-md-4 footer-items">
            <h4>Contact Us</h4>
            <p>If you have any questions, suggestions, or feedback, feel free to reach out to us. We'd love to hear from you!</p>
            <ul className="contact-info">
              <li>Email: info@examplelibrary.com</li>
              <li>Phone: +1 (123) 456-7890</li>
              <li>Address: 123 Main Street, City, Country</li>
            </ul>
          </div>
          <div className="col-md-4 footer-items">
            <h4>Follow Us</h4>
            <p>Stay connected with us on social media to get the latest updates, book recommendations, and library events.</p>
            <ul className="social-icons">
              <li><a href="#"><FontAwesomeIcon icon={faFacebook} /></a></li>
              <li><a href="#"><FontAwesomeIcon icon={faTwitter} /></a></li>
              <li><a href="#"><FontAwesomeIcon icon={faInstagram} /></a></li>
              <li><a href="#"><FontAwesomeIcon icon={faLinkedin} /></a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
