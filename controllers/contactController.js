const Contact = require('../models/Contact');

// @desc    Submit a new contact us inquiry
// @route   POST /api/contact
// @access  Public
const createContactInquiry = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, orderNumber, topic, message } = req.body;

    if (!firstName || !lastName || !email || !phone || !topic || !message) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    if (topic === '- SELECT -' || topic === '') {
      return res.status(400).json({ message: 'Please select a valid topic' });
    }

    const newInquiry = await Contact.create({
      firstName,
      lastName,
      email,
      phone,
      orderNumber: orderNumber || '',
      topic,
      message,
      status: 'Pending',
    });

    res.status(201).json({
      message: 'Thank you for contacting MONZATO. Your message has been received.',
      inquiry: newInquiry,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all contact inquiries (Admin)
// @route   GET /api/contact
// @access  Private/Admin
const getAllContactInquiries = async (req, res) => {
  try {
    const inquiries = await Contact.find({}).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update contact inquiry status (Admin)
// @route   PUT /api/contact/:id/status
// @access  Private/Admin
const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await Contact.findById(req.params.id);

    if (inquiry) {
      inquiry.status = status || inquiry.status;
      const updatedInquiry = await inquiry.save();
      res.json(updatedInquiry);
    } else {
      res.status(404).json({ message: 'Contact inquiry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete contact inquiry (Admin)
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteContactInquiry = async (req, res) => {
  try {
    const inquiry = await Contact.findById(req.params.id);

    if (inquiry) {
      await inquiry.deleteOne();
      res.json({ message: 'Contact inquiry deleted successfully' });
    } else {
      res.status(404).json({ message: 'Contact inquiry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createContactInquiry,
  getAllContactInquiries,
  updateContactStatus,
  deleteContactInquiry,
};
