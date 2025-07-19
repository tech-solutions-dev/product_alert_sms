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
    console.log(req.body);
    const fromDate = req.body.from ? new Date(req.body.from) : null;
    const toDate = req.body.to ? new Date(req.body.to) : null;
    console.log(
      `Generating report of type: ${type} from ${fromDate} to ${toDate}`
    );

    if (!type) {
      return res.status(400).json({ message: "Report type is required" });
    }
    let reports;
    if (type === "expiring") {
      console.log("Generating expiring report");
      reports = await Product.findAll({
        where: {
          expiryDate: {
            [Op.between]: [fromDate, toDate],
          },
        },
      });
    } else if (type === "expired") {
      console.log("Generating expired report");
      reports = await Product.findAll({
        where: {
          expiryDate: {
            [Op.lt]: new Date(),
            [Op.between]: [fromDate, toDate],
          },
        },
      });
    } else if (type === "fresh") {
      console.log("Generating fresh report");
      reports = await Product.findAll({
        where: {
          expiryDate: {
            [Op.gt]: new Date(),
            [Op.between]: [fromDate, toDate],
          },
        },
      });
    } else {
      return res.status(400).json({ message: "Invalid report type" });
    }
    console.log({ data: reports, count: reports.length });
    return res.json({data: reports,count: reports.length});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to generate report', error: err.message });
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