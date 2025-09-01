'use client';

import { useState, FormEvent } from 'react';
import emailjs from '@emailjs/browser';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Replace with your EmailJS service ID, template ID, and public key
      await emailjs.send(
        'service_id', // Replace with your service ID
        'template_id', // Replace with your template ID
        {
          from_name: name,
          from_email: email,
          message: message,
        },
        'public_key' // Replace with your public key
      );

      // Show success message
      const successEvent = new CustomEvent('emailSuccess');
      window.dispatchEvent(successEvent);

      // Reset form
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      // Show error message
      const errorEvent = new CustomEvent('emailError');
      window.dispatchEvent(errorEvent);
      console.error('Email sending failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="Contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-blue-700 text-lg font-medium mb-2">CONTACT ME</h2>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Get In Touch</h1>
          <div className="w-24 h-1 bg-blue-600 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <i className="fa-solid fa-location-dot text-2xl text-blue-600"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">My Address</h3>
            <p className="text-gray-600">Kathmandu, Nepal</p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <i className="fa-solid fa-envelope text-2xl text-blue-600"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Email Me</h3>
            <a href="mailto:asimkoirala01@gmail.com" className="text-blue-600 hover:text-blue-800 transition-colors">asimkoirala01@gmail.com</a>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <i className="fa-solid fa-user text-2xl text-blue-600"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">My Name</h3>
            <p className="text-gray-600">Asim Koirala</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12 bg-blue-700 text-white">
              <h3 className="text-2xl font-bold mb-4">Let&apos;s Talk</h3>
              <p className="mb-6 text-blue-100">I&apos;m always happy to chat about design, collaboration, or anything else that sparks your interest.</p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-4">
                    <i className="fa-solid fa-phone text-white"></i>
                  </div>
                  <p>Have a project in mind?</p>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-4">
                    <i className="fa-solid fa-envelope text-white"></i>
                  </div>
                  <p>Need a website or application?</p>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-4">
                    <i className="fa-solid fa-message text-white"></i>
                  </div>
                  <p>Just want to say hello?</p>
                </div>
              </div>
            </div>
            
            <div className="p-8 lg:p-12">
              <form onSubmit={handleSubmit} id="contact_form" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input 
                      type="text" 
                      className="w-full p-3 rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition bg-white text-black placeholder-gray-400" 
                      name="user_name" 
                      id="name" 
                      placeholder="John Doe" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required 
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="user_email" className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                    <input 
                      type="email" 
                      className="w-full p-3 rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition bg-white text-black placeholder-gray-400" 
                      name="user_email" 
                      id="user_email" 
                      placeholder="john@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                    <textarea 
                      name="message" 
                      rows={5} 
                      className="w-full p-3 rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition resize-none bg-white text-black placeholder-gray-400" 
                      id="message" 
                      placeholder="Hello, I'd like to talk about..." 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>
                
                <div>
                  <button 
                    type="submit" 
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-6 rounded-md transition-colors duration-300 shadow-md flex items-center justify-center" 
                    id="submit_btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-paper-plane mr-2"></i>
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;