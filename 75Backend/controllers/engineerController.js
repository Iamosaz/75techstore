// 75Backend/controllers/engineerController.js
import { EngineerRequest } from '../models/EngineerRequest.js';

// @desc    Create a new engineer request
// @route   POST /api/engineer
// @access  Private (Logged in users only)
export const createRequest = async (req, res) => {
  try {
    const { gadgetType, brand, issueDescription, contactNumber, address } = req.body;

    const newRequest = new EngineerRequest({
      user: req.user._id, // Comes from protect middleware
      gadgetType,
      brand,
      issueDescription,
      contactNumber,
      address,
    });

    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's requests
// @route   GET /api/engineer/my-requests
// @access  Private
export const getMyRequests = async (req, res) => {
  try {
    const requests = await EngineerRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all requests (For Admin)
// @route   GET /api/engineer
// @access  Private/Admin
export const getAllRequests = async (req, res) => {
  try {
    const requests = await EngineerRequest.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update request status (Admin assigns engineer)
// @route   PUT /api/engineer/:id
// @access  Private/Admin
export const updateRequestStatus = async (req, res) => {
  try {
    const request = await EngineerRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = req.body.status || request.status;
    request.assignedEngineerName = req.body.assignedEngineerName || request.assignedEngineerName;
    request.adminNotes = req.body.adminNotes || request.adminNotes;

    const updatedRequest = await request.save();
    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};