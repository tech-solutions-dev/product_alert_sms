const { Report, Product } = require('../models');
const { Op } = require('sequelize');

exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.findAll();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reports', error: err.message });
  }
};

exports.generateReport = async (req, res) => {
  try {
    const { type } = req.body;
    console.log(`Generating ${req.body} report`);
    let periodEnd = new Date();
    let periodStart = new Date();
    if (type === "monthly") {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else if (type === "weekly") {
      periodEnd.setDate(periodEnd.getDate() + 7);
    } else {
      return res.status(400).json({ message: "Invalid report type" });
    }
    const now = new Date();
    const expired = await Product.findAll({
      where: { expiryDate: { [Op.lt]: now } },
      order: [["expiryDate", "DESC"]],
    });
    const expiring = await Product.findAll({
      where: { expiryDate: { [Op.between]: [now, periodEnd] } },
      order: [["expiryDate", "ASC"]],
    });
    const report = await Report.create({
      type,
      data: { expired, expiring },
      generatedAt: now,
    });
    res.status(201).json(report);
  } catch (err) {
    console.error("Error generating report:", err);
    res
      .status(500)
      .json({ message: "Failed to generate report", error: err.message });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findByPk(id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch report', error: err.message });
  }
}