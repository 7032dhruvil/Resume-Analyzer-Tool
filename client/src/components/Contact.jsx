import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';

// New FAQSection component
const FAQSection = ({ faqs }) => (
  <div className="card p-6 mt-8 lg:mt-0">
    <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-4">
      Frequently Asked Questions
    </h3>
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="bg-secondary-50 dark:bg-secondary-900/30 rounded-lg p-4 border border-secondary-100 dark:border-secondary-800"
        >
          <h4 className="font-semibold text-secondary-900 dark:text-white mb-2 text-sm">
            {faq.question}
          </h4>
          <p className="text-secondary-600 dark:text-secondary-300 text-xs">
            {faq.answer}
          </p>
        </div>
      ))}
    </div>
  </div>
);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrors({});
    // Validate required fields
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.message) newErrors.message = 'Message is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message
        })
      });
      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSubmitStatus(null), 3000);
      } else {
        const data = await response.json();
        setSubmitStatus('error');
        setErrors({ form: data.error || 'Failed to submit contact form' });
      }
    } catch (err) {
      setSubmitStatus('error');
      setErrors({ form: 'Failed to submit contact form' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <FaEnvelope className="w-5 h-5" />,
      title: "Email Us",
      details: ["xyzdeveloper10@gmail.com", "info@samplemail.com"],
      color: "text-primary-600 dark:text-primary-400"
    },
    {
      icon: <FaPhone className="w-5 h-5" />,
      title: "Call Us",
      details: ["+91 8690295298", "+91 9876543210"],
      color: "text-success-600 dark:text-success-400"
    },
    {
      icon: <FaMapMarkerAlt className="w-5 h-5" />,
      title: "Visit Us",
      details: ["Ahmedabad, Gujarat, India", "380015"],
      color: "text-warning-600 dark:text-warning-400"
    },
    {
      icon: <FaClock className="w-5 h-5" />,
      title: "Business Hours",
      details: ["Mon-Fri: 10AM-7PM IST", "Sat: 10AM-2PM IST"],
      color: "text-error-600 dark:text-error-400"
    }
  ];

  const faqs = [
    {
      question: "How accurate is the AI analysis?",
      answer: "Our AI achieves 95% accuracy in resume analysis, providing detailed insights on formatting, content, and optimization opportunities."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely! We use enterprise-grade encryption and never store your resume permanently. Your privacy is our top priority."
    },
    {
      question: "What file formats are supported?",
      answer: "We support PDF, DOC, DOCX, and TXT files. For best results, we recommend using PDF format."
    },
    {
      question: "How long does analysis take?",
      answer: "Analysis typically completes in 10-30 seconds, depending on the complexity and length of your resume."
    }
  ];

  return (
    <section id="contact" className="py-16 bg-gradient-to-br from-secondary-50 to-primary-50 dark:from-secondary-900 dark:to-secondary-800">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
            Get in Touch
          </h2>
          <p className="text-lg text-secondary-600 dark:text-secondary-300 max-w-2xl mx-auto">
            Have questions about our AI resume analyzer? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-0">
          {/* Contact Form */}
          <div className="lg:col-span-2 card">
            <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-6">
              Send us a Message
            </h3>
            
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg flex items-center space-x-3">
                <FaCheckCircle className="w-5 h-5 text-success-600 dark:text-success-400" />
                <span className="text-success-700 dark:text-success-300 font-medium">
                  Message sent successfully! We'll get back to you soon.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="What's this about?"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="card p-6 flex flex-col justify-evenly">
            <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-4">
              Contact Information
            </h3>
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-10 h-10 bg-secondary-100 dark:bg-secondary-800 rounded-lg flex items-center justify-center ${info.color}`}>
                    {info.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary-900 dark:text-white mb-1">
                      {info.title}
                    </h4>
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-secondary-600 dark:text-secondary-300 text-sm">
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section: full width below the grid */}
        <div className="mt-12 mb-12">
          <FAQSection faqs={faqs} />
        </div>

        {/* Map/Office Section */}
        <div className="card text-center">
          <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-4">
            Visit Our Office
          </h3>
          <p className="text-secondary-600 dark:text-secondary-300 mb-6">
            We're located in Ahmedabad, Gujarat, India
          </p>
          <div className="bg-secondary-200 dark:bg-secondary-700 rounded-lg overflow-hidden flex items-center justify-center" style={{ height: '300px' }}>
            <iframe
              title="Ahmedabad, Gujarat, India Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.012441234262!2d72.5713623153636!3d23.0225059849437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84f2f5e4b1e7%3A0x5e4b1e7e4b1e7e4b!2sAhmedabad%2C%20Gujarat%2C%20India!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact; 