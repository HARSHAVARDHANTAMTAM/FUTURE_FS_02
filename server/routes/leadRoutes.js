const authMiddleware =
require("../middleware/authMiddleware");

const express = require("express");

const router = express.Router();

const Lead = require("../models/Lead");


// CREATE LEAD
router.post(
  "/",
  authMiddleware,
  async (req, res) => {

    try {

      const newLead =
        new Lead(req.body);

      await newLead.save();

      res.status(201).json({
        message: "Lead Created",
        newLead
      });

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  }
);


// DELETE LEAD
router.delete(
  "/:id",
  authMiddleware,
  async (req, res) => {

    try {

      await Lead.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message: "Lead Deleted"
      });

    } catch (error) {

      res.status(500).json({
        error: error.message
      });

    }

  }
);


// GET ALL LEADS
router.get(
  "/",
  authMiddleware,
  async (req, res) => {

    try {

      const leads =
        await Lead.find();

      res.json(leads);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  }
);


// UPDATE LEAD STATUS
router.put(
  "/:id",
  authMiddleware,
  async (req, res) => {

    try {

      const updatedLead =
        await Lead.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
        );

      res.json(updatedLead);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  }
);

module.exports = router;