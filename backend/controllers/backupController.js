const { Backup } = require('../models');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const sequelize = require('../config/database');

exports.getAllBackups = async (req, res) => {
  try {
    const backups = await Backup.findAll();
    res.json(backups);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch backups', error: err.message });
  }
};

exports.createBackup = async (req, res) => {
  const dbConfig = sequelize.config;
  try {
    const fileName = `backup-${Date.now()}.sql`;
    const backupDir = path.join(__dirname, '../../backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    const filePath = path.join(backupDir, fileName);

    const { username, password, database, host, port } = dbConfig;
    const dumpCmd = `mysqldump -u${username} ${password ? `-p${password}` : ''} -h${host || 'localhost'}${port ? ` -P${port}` : ''} ${database} > "${filePath}"`;
    exec(dumpCmd, async (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ message: 'Backup failed', error: stderr || error.message });
      }
      const backup = await Backup.create({ filePath });
      res.status(201).json(backup);
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create backup', error: err.message });
  }
};

exports.restoreBackup = async (req, res) => {
  const { backupId } = req.params;
  try {
    const backup = await Backup.findByPk(backupId);
    if (!backup) {
      return res.status(404).json({ message: 'Backup not found' });
    }

    const restoreCmd = `mysql -u${sequelize.config.username} ${sequelize.config.password ? `-p${sequelize.config.password}` : ''} -h${sequelize.config.host || 'localhost'}${sequelize.config.port ? ` -P${sequelize.config.port}` : ''} ${sequelize.config.database} < "${backup.filePath}"`;
    exec(restoreCmd, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ message: 'Restore failed', error: stderr || error.message });
      }
      res.json({ message: 'Backup restored successfully' });
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to restore backup', error: err.message });
  }
};