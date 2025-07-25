const PDFDocument = require('pdfkit');
const { getProductStatus } = require('../config/utils');

const ICONS = {
    products: '📦',
    fresh: '✅',
    expiring: '⚠️',
    expired: '❌',
    categories: '🗂️',
    value: '💰',
    time: '⏰',
    trend: '📈',
    risk: '🚨',
    warning: '⚠️',
    success: '✅',
    info: 'ℹ️',
    calendar: '📅',
    chart: '📊',
    report: '📑',
    settings: '⚙️',
    search: '🔍',
    alert: '🔔',
    critical: '🔥'
  };
  
  const COLORS = {
    blue: {
      primary: '#1e40af', // Darker blue
      secondary: '#1e3a8a',
      light: '#3b82f6'
    },
    red: {
      primary: '#991b1b', // Darker red
      secondary: '#7f1d1d',
      light: '#dc2626'
    },
    green: {
      primary: '#166534', // Darker green
      secondary: '#14532d',
      light: '#16a34a'
    },
    orange: {
      primary: '#9a3412', // Darker orange
      secondary: '#7c2d12',
      light: '#ea580c'
    },
    purple: {
      primary: '#6b21a8', // Darker purple
      secondary: '#581c87',
      light: '#9333ea'
    },
    gray: {
      primary: '#1f2937',
      secondary: '#111827',
      light: '#374151'
    },
    white: {
      primary: '#ffffff',
      secondary: '#f9fafb',
      light: '#f3f4f6'
    }
  };




async function pdfGenerator(res, products, filters) {
    const { 
        includeCharts = true,
        reportType = 'detailed',
      } = filters;
    const doc = new PDFDocument({ 
        margin: 50, 
        size: 'A4',
        bufferPages: true,
        info: {
          Title: `Products Report - ${new Date().toLocaleDateString()}`,
          Author: 'ExpireTracker Pro',
          Subject: 'Product Inventory Report with Analytics',
          Keywords: 'products, inventory, report, analytics, expiry',
          Creator: 'ExpireTracker Pro System',
          Producer: 'PDFKit Enhanced Report Generator'
        }
      });
    
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `products-report-${reportType}-${timestamp}.pdf`;
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Cache-Control', 'no-cache');
      doc.pipe(res);
    
      const pageWidth = doc.page.width - 100;
      
      drawEnhancedHeader(doc, pageWidth);
      
      drawExecutiveSummary(doc, products, filters, pageWidth);
      
      drawKeyMetrics(doc, products, pageWidth);
      
      if (includeCharts !== false) {
        if (products.length > 0) {
          doc.addPage();
          drawAdvancedCharts(doc, products, pageWidth);
          
          drawRiskAssessment(doc, products, pageWidth);
          
          drawTrendAnalysis(doc, products, pageWidth);
        }
      }
      
      if (reportType !== 'summary' && products.length > 0) {
        doc.addPage();
        drawEnhancedProductsTable(doc, products, pageWidth, reportType);
      }
      
      const recommendations = generateRecommendations(products);
      if (recommendations.length > 0) {
        doc.addPage();
        drawRecommendations(doc, products, pageWidth);
      }
      
      addPageNumbers(doc);
      drawEnhancedFooter(doc);
      
      
      doc.end();
}


function drawEnhancedHeader(doc, pageWidth) {
doc.save();

const headerHeight = 180;
const gradientColors = [COLORS.blue.secondary, COLORS.blue.primary, COLORS.blue.light];
const segmentHeight = headerHeight / gradientColors.length;

gradientColors.forEach((color, index) => {
  for (let i = 0; i < segmentHeight; i++) {
    const y = index * segmentHeight + i;
    doc.rect(0, y, doc.page.width, 1)
       .fillColor(color)
       .fill();
  }
});

doc.circle(70, 70, 35)
   .fillColor(COLORS.white.secondary)
   .fill();

const titleX = 130;

doc.fontSize(38)
   .font('Helvetica-Bold')
   .fillColor(COLORS.gray.secondary)
   .text('INVENTORY', titleX + 2, 40);

doc.fontSize(38)
   .font('Helvetica-Bold')
   .fillColor('#ffffff')
   .text('INVENTORY', titleX, 38);

doc.fontSize(32)
   .font('Helvetica-Bold')
   .fillColor(COLORS.gray.secondary)
   .text('ANALYTICS', titleX + 2, 82);

doc.fontSize(32)
   .font('Helvetica-Bold')
   .fillColor('#ffffff')
   .text('ANALYTICS', titleX, 80);

const now = new Date();
const metaBoxes = [
  { label: 'Generated', value: now.toLocaleDateString() },
  { label: 'Time', value: now.toLocaleTimeString() },
  { label: 'Status', value: 'Active Report' }
];

const totalMetaWidth = pageWidth - 80;
const metaWidth = totalMetaWidth / 3;
const metaSpacing = 10; 
const metaY = 132; 
let metaX = 40; 

metaBoxes.forEach((box) => {
  doc.roundedRect(metaX, metaY, metaWidth - metaSpacing, 35, 4)
     .fillColor(COLORS.blue.secondary)
     .fill()
     .strokeColor('#ffffff')
     .lineWidth(0.5)
     .stroke();
  
  doc.fontSize(10)
     .fillColor('#ffffff')
     .text(box.label, metaX + 10, metaY + 8);

  doc.fontSize(12)
     .font('Helvetica-Bold')
     .fillColor('#ffffff')
     .text(box.value, metaX + 10, metaY + 22);

  metaX += metaWidth;
});

doc.restore();
doc.y = headerHeight + 30;
}

function drawExecutiveSummary(doc, products, filters, pageWidth) {
drawSectionHeader(doc, 'EXECUTIVE SUMMARY', pageWidth);

doc.roundedRect(40, doc.y, pageWidth, 60, 8)
   .fillColor(COLORS.white.primary)
   .fill()
   .stroke(COLORS.white.secondary);

doc.fontSize(12)
   .fillColor('#0f172a')
   .font('Helvetica-Bold')
   .text('Applied Filters & Scope', 55, doc.y + 15);

doc.moveDown(0.5);
doc.fontSize(10)
   .font('Helvetica')
   .fillColor('#1e293b');

const filterSummary = buildFilterSummary(filters);
doc.text(filterSummary, 55, doc.y, { width: pageWidth - 30 });

doc.y += 80;

const stats = calculateAdvancedStats(products);
drawEnhancedSummaryBoxes(doc, stats, pageWidth);
}

function drawKeyMetrics(doc, products, pageWidth) {
doc.moveDown(2);
drawSectionHeader(doc, 'KEY PERFORMANCE INDICATORS', pageWidth);

const metrics = calculateKPIs(products);

const boxWidth = (pageWidth - 40) / 3;
const boxHeight = 80;
const startY = doc.y + 10;

metrics.forEach((metric, index) => {
  const x = 40 + (index % 3) * (boxWidth + 20);
  const y = startY + Math.floor(index / 3) * (boxHeight + 20);
  
  drawGradientBox(doc, x, y, boxWidth, boxHeight, metric.color, metric.secondaryColor);
  
  doc.fontSize(24)
     .fillColor('#ffffff')
     .text(metric.icon, x + 15, y + 15);
  
  doc.fontSize(24)
     .font('Helvetica-Bold')
     .fillColor('#ffffff')
     .text(metric.value, x + 55, y + 12);
  
  doc.fontSize(11)
     .font('Helvetica')
     .text(metric.label, x + 15, y + 45);
  
  if (metric.trend) {
    doc.fontSize(10)
       .fillColor(metric.trend.direction === 'up' ? '#10b981' : '#ef4444')
       .text(metric.trend.text, x + 15, y + 60);
  }
});

doc.y = startY + Math.ceil(metrics.length / 3) * (boxHeight + 20) + 20;
}

function drawAdvancedCharts(doc, products, pageWidth) {
drawEnhancedStatusChart(doc, products, pageWidth);

doc.y += 200;
drawEnhancedCategoryChart(doc, products, pageWidth);

if (doc.y > doc.page.height - 300) {
  doc.addPage();
}
drawExpiryTimelineChart(doc, products, pageWidth);
}

function drawRiskAssessment(doc, products, pageWidth) {
drawSectionHeader(doc, 'RISK ASSESSMENT', pageWidth);

const risks = assessRisks(products);
const riskLevel = calculateOverallRisk(risks);

const indicatorWidth = pageWidth - 80;
const indicatorHeight = 50;
const x = 40;
let y = doc.y + 20;

if (y + indicatorHeight + (risks.length * 80) + 150 > doc.page.height - 100) {
  doc.addPage();
  y = 50;
}

doc.roundedRect(x, y, indicatorWidth, indicatorHeight, 8)
   .fillColor(COLORS.gray.secondary)
   .fill();

const fillWidth = (riskLevel.score / 100) * (indicatorWidth - 4);
const riskColor = riskLevel.score > 70 ? COLORS.red.primary : 
                 riskLevel.score > 40 ? COLORS.orange.primary : 
                 COLORS.green.primary;

doc.roundedRect(x + 2, y + 2, fillWidth, indicatorHeight - 4, 6)
   .fillColor(riskColor)
   .fill();

doc.fontSize(24)
   .font('Helvetica-Bold')
   .fillColor('#ffffff')
   .text(`${riskLevel.score}%`, x + 20, y + 14);

doc.fontSize(16)
   .font('Helvetica-Bold')
   .fillColor('#ffffff')
   .text(riskLevel.level.toUpperCase() + ' RISK LEVEL', 
         x + 90, y + 16);

let currentY = y + indicatorHeight + 30;

const riskItemsWidth = pageWidth - 80;
const containerHeight = risks.length * 80 + 20;

if (currentY + containerHeight > doc.page.height - 100) {
  doc.addPage();
  currentY = 50;
}

doc.roundedRect(x, currentY, riskItemsWidth, containerHeight, 8)
   .fillColor('#ffffff')
   .fill()
   .strokeColor(COLORS.gray.primary)
   .lineWidth(1)
   .stroke();

currentY += 10;

risks.forEach((risk, index) => {
  const itemY = currentY + (index * 80);
  const itemX = x + 15;
  const itemWidth = riskItemsWidth - 30;
  
  const bgColor = risk.level === 'high' ? COLORS.red.primary :
                 risk.level === 'medium' ? COLORS.orange.primary :
                 COLORS.green.primary;
  
  doc.roundedRect(itemX, itemY, itemWidth, 70, 6)
     .fillColor(bgColor)
     .fill();
  
  doc.roundedRect(itemX + 10, itemY + 10, 80, 24, 4)
     .fillColor(COLORS.gray.secondary)
     .fill();
  
  doc.fontSize(12)
     .font('Helvetica-Bold')
     .fillColor('#ffffff')
     .text(risk.level.toUpperCase(), 
           itemX + 20, 
           itemY + 16);
  
  doc.fontSize(14)
     .font('Helvetica-Bold')
     .fillColor('#ffffff')
     .text(risk.title, 
           itemX + 100, 
           itemY + 12,
           { width: itemWidth - 120 });
  
  doc.fontSize(11)
     .font('Helvetica')
     .fillColor('#ffffff')
     .text(risk.description, 
           itemX + 15, 
           itemY + 40,
           { width: itemWidth - 30 });
});

if (riskLevel.score > 40) {
  currentY += containerHeight + 20;
  
  if (currentY + 100 > doc.page.height - 100) {
    doc.addPage();
    currentY = 50;
  }
  
  doc.roundedRect(x, currentY, riskItemsWidth, 80, 8)
     .fillColor(COLORS.blue.secondary)
     .fill();
  
  doc.fontSize(14)
     .font('Helvetica-Bold')
     .fillColor('#ffffff')
     .text('RECOMMENDED ACTIONS', 
           x + 15, 
           currentY + 15);
  
  const recommendations = generateRiskRecommendations(risks);
  doc.fontSize(11)
     .font('Helvetica')
     .fillColor('#ffffff')
     .text(recommendations, 
           x + 15, 
           currentY + 35,
           { width: riskItemsWidth - 30 });
  
  currentY += 100;
}

doc.y = currentY + 20;
}

function drawTrendAnalysis(doc, products, pageWidth) {
drawSectionHeader(doc, 'TREND ANALYSIS', pageWidth);

const monthlyData = calculateMonthlyExpiryTrend(products);
drawTrendLine(doc, monthlyData, pageWidth);
}

function drawEnhancedProductsTable(doc, products, pageWidth, reportType) {
doc.addPage();
drawSectionHeader(doc, 'DETAILED PRODUCT LISTING', pageWidth);

let filteredProducts = products;
if (reportType === 'critical') {
  filteredProducts = products.filter(p => {
    const status = getProductStatus(p);
    return status === 'Expired' || status === 'Expiring Soon';
  });
}

const headers = ['#', 'Product Name', 'Category', 'Barcode', 'Expiry Date', 'Status', 'Risk Level'];
const colWidths = [35, 140, 85, 75, 80, 70, 65];
const tableWidth = colWidths.reduce((sum, width) => sum + width, 0);
const startX = (pageWidth - tableWidth) / 2 + 50;

drawEnhancedTable(doc, filteredProducts, headers, colWidths, startX);
}

function drawRecommendations(doc, products, pageWidth) {
doc.addPage();
drawSectionHeader(doc, 'RECOMMENDATIONS & ACTION ITEMS', pageWidth);

const recommendations = generateRecommendations(products);

recommendations.forEach((rec, index) => {
  const y = doc.y;
  
  const priorityColor = getPriorityColor(rec.priority);
  doc.circle(50, y + 15, 6)
     .fillColor(priorityColor)
     .fill();
  
  doc.roundedRect(65, y, pageWidth - 25, rec.height || 50, 5)
     .fillColor('#f8fafc')
     .fill()
     .stroke('#e2e8f0');
  
  doc.fontSize(12)
     .fillColor('#1e293b')
     .font('Helvetica-Bold')
     .text(`${rec.icon} ${rec.title}`, 75, y + 10);
  
  doc.fontSize(10)
     .font('Helvetica')
     .fillColor('#64748b')
     .text(rec.description, 75, y + 28, { width: pageWidth - 50 });
  
  doc.y = y + (rec.height || 50) + 10;
});
}

function buildFilterSummary(filters) {
const parts = [];
if (filters.name) parts.push(`Name contains: "${filters.name}"`);
if (filters.categoryId) parts.push(`Category ID: ${filters.categoryId}`);
if (filters.status) parts.push(`Status: ${filters.status}`);
if (filters.dateRange?.start) parts.push(`Expiry after: ${new Date(filters.dateRange.start).toLocaleDateString()}`);
if (filters.dateRange?.end) parts.push(`Expiry before: ${new Date(filters.dateRange.end).toLocaleDateString()}`);

return parts.length ? parts.join(' • ') : 'No filters applied - showing all products';
}

function calculateAdvancedStats(products) {
const now = new Date();
const stats = {
  total: products.length,
  expired: 0,
  expiringSoon: 0,
  fresh: 0,
  categories: new Set(),
  avgDaysToExpiry: 0,
  totalValue: 0
};

let daysSum = 0;
let validExpiryCount = 0;

products.forEach(product => {
  if (product.Category) stats.categories.add(product.Category.name);
  
  if (product.expiryDate) {
    const expiryDate = new Date(product.expiryDate);
    const daysToExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
    
    daysSum += daysToExpiry;
    validExpiryCount++;
    
    if (daysToExpiry < 0) {
      stats.expired++;
    } else if (daysToExpiry <= 30) {
      stats.expiringSoon++;
    } else {
      stats.fresh++;
    }
  }
  
  if (product.value) stats.totalValue += parseFloat(product.value);
});

stats.avgDaysToExpiry = validExpiryCount > 0 ? Math.round(daysSum / validExpiryCount) : 0;
stats.categoriesCount = stats.categories.size;
stats.riskScore = calculateRiskScore(stats);

return stats;
}

function calculateKPIs(products) {
const stats = calculateAdvancedStats(products);
const expiryRate = stats.total > 0 ? ((stats.expired + stats.expiringSoon) / stats.total * 100).toFixed(1) : 0;
const healthScore = Math.max(0, 100 - expiryRate);

return [
  {
    icon: '#',
    label: 'Total Products',
    value: stats.total.toString(),
    color: '#3b82f6',
    secondaryColor: '#1d4ed8'
  },
  {
    icon: '!',
    label: 'Expiry Rate',
    value: `${expiryRate}%`,
    color: '#ef4444',
    secondaryColor: '#dc2626'
  },
  {
    icon: '+',
    label: 'Health Score',
    value: `${healthScore.toFixed(0)}%`,
    color: '#10b981',
    secondaryColor: '#059669'
  },
  {
    icon: '*',
    label: 'Categories',
    value: stats.categoriesCount.toString(),
    color: '#8b5cf6',
    secondaryColor: '#7c3aed'
  },
  {
    icon: 'T',
    label: 'Avg Days to Expiry',
    value: stats.avgDaysToExpiry.toString(),
    color: '#f59e0b',
    secondaryColor: '#d97706'
  },
  {
    icon: '$',
    label: 'Total Value',
    value: `$${stats.totalValue.toFixed(0)}`,
    color: '#06b6d4',
    secondaryColor: '#0891b2'
  }
];
}

function drawSectionHeader(doc, title, pageWidth) {
const y = doc.y;

// Background with darker color
doc.rect(40, y, pageWidth, 35)
   .fillColor(COLORS.gray.primary)
   .fill();

doc.rect(40, y, 5, 35)
   .fillColor(COLORS.blue.light)
   .fill();

doc.fontSize(16)
   .fillColor('#ffffff')
   .font('Helvetica-Bold')
   .text(title, 55, y + 10);

doc.y = y + 45;
}

function drawGradientBox(doc, x, y, width, height, color1, color2) {
for (let i = 0; i < height; i++) {
  const factor = i / height;
  doc.rect(x, y + i, width, 1)
     .fillColor(color1, 1 - factor * 0.3)
     .fill();
}
}

function drawEnhancedSummaryBoxes(doc, stats, pageWidth) {
const boxWidth = (pageWidth - 75) / 4;
const boxHeight = 90;
const startX = 40;
const y = doc.y + 10;
const boxSpacing = 15;

const boxes = [
  { 
    label: 'Total Products',
    value: stats.total,
    color: COLORS.blue.primary,
    subtitle: `${stats.categoriesCount} categories`
  },
  { 
    label: 'Fresh Products',
    value: stats.fresh,
    color: COLORS.green.primary,
    subtitle: `${((stats.fresh/stats.total)*100).toFixed(1)}% healthy`
  },
  { 
    label: 'Expiring Soon',
    value: stats.expiringSoon,
    color: COLORS.orange.primary,
    subtitle: 'Within 30 days'
  },
  { 
    label: 'Expired',
    value: stats.expired,
    color: COLORS.red.primary,
    subtitle: 'Critical'
  }
];

boxes.forEach((box, index) => {
  const x = startX + (index * (boxWidth + boxSpacing));
  
  doc.roundedRect(x + 2, y + 2, boxWidth, boxHeight, 8)
     .fillColor('#000000', 0.3)
     .fill();
  
  doc.roundedRect(x, y, boxWidth, boxHeight, 8)
     .fillColor(box.color)
     .fill();
  
  doc.fontSize(14)
     .fillColor('#ffffff')
     .font('Helvetica-Bold')
     .text(box.label, x + 10, y + 10, { width: boxWidth - 30 });
  
  doc.fontSize(20)
     .fillColor('#ffffff')
     .font('Helvetica-Bold')
     .text(box.value.toString(), x + 22, y + 38, { width: boxWidth - 30 });
  
  doc.fontSize(12)
     .fillColor('#ffffff')
     .font('Helvetica')
     .text(box.subtitle, x + 15, y + 65, { width: boxWidth - 30 });
});
}

function drawEnhancedStatusChart(doc, products, pageWidth) {
if (products.length === 0) return;

const stats = calculateAdvancedStats(products);
const chartData = [
  { label: 'Fresh', value: stats.fresh, color: '#16a34a', percentage: ((stats.fresh/stats.total)*100).toFixed(1) },
  { label: 'Expiring Soon', value: stats.expiringSoon, color: '#ca8a04', percentage: ((stats.expiringSoon/stats.total)*100).toFixed(1) },
  { label: 'Expired', value: stats.expired, color: '#dc2626', percentage: ((stats.expired/stats.total)*100).toFixed(1) }
].filter(item => item.value > 0);

if (chartData.length > 0) {
  const panelY = doc.y;
  doc.rect(30, panelY, pageWidth + 40, 250)
     .fillColor('#ffffff')
     .fill()
     .strokeColor('#e2e8f0')
     .lineWidth(1)
     .stroke();
  
  doc.rect(30, panelY, 4, 30)
     .fillColor('#2563eb')
     .fill();
  
  doc.fontSize(16)
     .font('Helvetica-Bold')
     .fillColor('#1e293b')
     .text('Status Distribution', 45, panelY + 8);
  
  drawEnhancedPieChart(doc, chartData, 200, panelY + 120, 80);
  drawEnhancedChartLegend(doc, chartData, 350, panelY + 60);
}
}

function drawEnhancedCategoryChart(doc, products, pageWidth) {
const categoryCount = {};
products.forEach(product => {
  const categoryName = product.Category ? product.Category.name : 'Uncategorized';
  categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
});

const chartData = Object.entries(categoryCount)
  .map(([label, value], index) => ({
    label,
    value,
    color: getChartColor(index),
    percentage: ((value/products.length)*100).toFixed(1)
  }))
  .sort((a, b) => b.value - a.value)
  .slice(0, 10);

if (chartData.length > 0) {
  drawHorizontalBarChart(doc, chartData, 50, doc.y, pageWidth - 100, 200);
}
}

function calculateRiskScore(stats) {
const expiredWeight = 3;
const expiringSoonWeight = 2;
const totalItems = stats.total || 1;

return Math.min(100, 
  ((stats.expired * expiredWeight + stats.expiringSoon * expiringSoonWeight) / totalItems) * 20
);
}

function assessRisks(products) {
const risks = [];
const stats = calculateAdvancedStats(products);

if (stats.expired > 0) {
  risks.push({
    level: 'high',
    title: 'Expired Products Detected',
    description: `${stats.expired} products have expired and require immediate removal from inventory.`
  });
}

if (stats.expiringSoon > stats.total * 0.2) {
  risks.push({
    level: 'high',
    title: 'High Volume of Products Expiring Soon',
    description: `${stats.expiringSoon} products (${((stats.expiringSoon/stats.total)*100).toFixed(1)}%) will expire within 30 days.`
  });
}

if (stats.expiringSoon > stats.total * 0.1) {
  risks.push({
    level: 'medium',
    title: 'Inventory Balance Warning',
    description: `Consider reordering fresh stock as ${((stats.expiringSoon/stats.total)*100).toFixed(1)}% of inventory is approaching expiry.`
  });
}

if (risks.length === 0) {
  risks.push({
    level: 'low',
    title: 'Healthy Inventory Status',
    description: 'Inventory levels and expiry dates are within normal parameters.'
  });
}

return risks;
}

function generateRecommendations(products) {
const recommendations = [];
const stats = calculateAdvancedStats(products);

if (stats.expired > 0) {
  recommendations.push({
    priority: 'high',
    icon: '!',
    title: 'Immediate Action Required',
    description: `Remove ${stats.expired} expired products from inventory immediately to prevent health risks.`,
    height: 60
  });
}

if (stats.expiringSoon > 0) {
  recommendations.push({
    priority: 'medium',
    icon: '*',
    title: 'Promotion Strategy',
    description: `Create promotional campaigns for ${stats.expiringSoon} products expiring within 30 days.`,
    height: 60
  });
}

return recommendations;
}

function generateRiskRecommendations(risks) {
const recommendations = [];

risks.forEach(risk => {
  if (risk.level === 'high') {
    recommendations.push(`• Immediate action required: ${risk.description}`);
  } else if (risk.level === 'medium') {
    recommendations.push(`• Plan action soon: ${risk.description}`);
  }
});

return recommendations.join('\n') || 'No immediate actions required.';
}

function getRiskColor(level) {
const colors = {
  'low': COLORS.green.primary,
  'medium': COLORS.orange.primary,
  'high': COLORS.red.primary
};
return colors[level] || COLORS.gray.primary;
}

function getPriorityColor(priority) {
const colors = {
  'low': '#10b981',
  'medium': '#f59e0b',
  'high': '#ef4444'
};
return colors[priority] || '#6b7280';
}

function getChartColor(index) {
const colors = [
  COLORS.blue.primary,
  COLORS.red.primary,
  COLORS.green.primary,
  COLORS.purple.primary,
  COLORS.orange.primary,
  COLORS.blue.secondary,
  COLORS.red.secondary,
  COLORS.green.secondary
];
return colors[index % colors.length];
}

function addPageNumbers(doc) {
const range = doc.bufferedPageRange();
for (let i = 0; i < range.count; i++) {
  doc.switchToPage(i);
  
  if (doc.page.content && doc.page.content.length > 0) {
    // Page numbers with better contrast
    doc.fontSize(10)
       .fillColor('#1e293b')
       .text(`Page ${i + 1} of ${range.count}`, 
             doc.page.width - 100, 
             doc.page.height - 30,
             { align: 'right' });
  }
}
}

function drawEnhancedFooter(doc) {
const range = doc.bufferedPageRange();

for (let i = 0; i < range.count; i++) {
  doc.switchToPage(i);
  
  if (doc.page.content && doc.page.content.length > 0) {
    // Footer line with better visibility
    doc.moveTo(40, doc.page.height - 50)
       .lineTo(doc.page.width - 40, doc.page.height - 50)
       .strokeColor('#94a3b8')
       .lineWidth(1)
       .stroke();
    
    const footerText = `ExpireTracker Pro © ${new Date().getFullYear()} | Confidential Report | Generated: ${new Date().toLocaleString()}`;
    doc.fontSize(8)
       .fillColor('#1e293b')
       .text(footerText, 40, doc.page.height - 35, { 
         align: 'center',
         width: doc.page.width - 80
       });
  }
}
}

function drawEnhancedPieChart(doc, data, centerX, centerY, radius) {
const total = data.reduce((sum, item) => sum + item.value, 0);

if (total === 0) {
  doc.circle(centerX, centerY, radius)
     .strokeColor(COLORS.gray.primary)
     .lineWidth(2)
     .stroke();
  
  doc.fontSize(12)
     .fillColor(COLORS.gray.primary)
     .text('No data', centerX - 25, centerY - 6, { width: 50, align: 'center' });
  return;
}

let currentAngle = -90;

data.forEach((item, index) => {
  if (item.value > 0) {
    const sliceAngle = (item.value / total) * 360;
    
    doc.save();
    
    const shadowOffset = 3;
    doc.moveTo(centerX + shadowOffset, centerY + shadowOffset);
    doc.arc(centerX + shadowOffset, centerY + shadowOffset, radius, 
            currentAngle * Math.PI / 180, 
            (currentAngle + sliceAngle) * Math.PI / 180);
    doc.closePath();
    doc.fillColor('#000000', 0.3);
    doc.fill();
    
    doc.moveTo(centerX, centerY);
    doc.arc(centerX, centerY, radius, 
            currentAngle * Math.PI / 180, 
            (currentAngle + sliceAngle) * Math.PI / 180);
    doc.closePath();
    doc.fillColor(getChartColor(index));
    doc.fill();
    
    currentAngle += sliceAngle;
  }
});

doc.circle(centerX, centerY, radius * 0.4)
   .fillColor('#ffffff')
   .fill()
   .strokeColor(COLORS.gray.primary)
   .lineWidth(1.5)
   .stroke();

doc.fontSize(16)
   .fillColor(COLORS.gray.secondary)
   .font('Helvetica-Bold')
   .text(total.toString(), centerX - 15, centerY - 12, { width: 30, align: 'center' });

doc.fontSize(10)
   .fillColor(COLORS.gray.primary)
   .font('Helvetica')
   .text('Total', centerX - 15, centerY + 5, { width: 30, align: 'center' });
}

function drawEnhancedChartLegend(doc, data, x, y) {
const legendSpacing = 35;
const legendWidth = 150;
const legendHeight = 30;

data.forEach((item, index) => {
  const legendY = y + (index * legendSpacing);
  
  doc.roundedRect(x - 5, legendY - 5, legendWidth, legendHeight, 4)
     .fillColor('#ffffff')
     .fill()
     .strokeColor(COLORS.gray.primary)
     .lineWidth(0.5)
     .stroke();
  
  doc.rect(x, legendY, 20, 20)
     .fillColor(item.color)
     .fill()
     .strokeColor(COLORS.gray.primary)
     .lineWidth(1)
     .stroke();
  
  doc.fontSize(11)
     .font('Helvetica-Bold')
     .fillColor(COLORS.gray.secondary)
     .text(item.label, x + 30, legendY + 2, { width: legendWidth - 40 });
  
  doc.fontSize(10)
     .font('Helvetica')
     .fillColor(COLORS.gray.primary)
     .text(`${item.value} (${item.percentage}%)`, x + 30, legendY + 16, 
           { width: legendWidth - 40 });
});
}

function drawHorizontalBarChart(doc, data, x, y, width, height) {
const maxValue = Math.max(...data.map(item => item.value));
const barHeight = Math.min(25, (height - 20) / data.length - 10);
const maxBarWidth = width - 180;
const labelWidth = 120;

doc.roundedRect(x, y - 10, width, height + 20, 5)
   .fillColor('#ffffff')
   .fill()
   .strokeColor(COLORS.gray.primary)
   .lineWidth(1)
   .stroke();

data.forEach((item, index) => {
  const barY = y + (index * (barHeight + 10));
  const barWidth = Math.max(2, (item.value / maxValue) * maxBarWidth);
  
  doc.roundedRect(x, barY, labelWidth, barHeight, 3)
     .fillColor('#ffffff')
     .fill()
     .strokeColor(COLORS.gray.primary)
     .lineWidth(0.5)
     .stroke();
  
  doc.fontSize(11)
     .fillColor(COLORS.gray.secondary)
     .font('Helvetica-Bold')
     .text(item.label, x + 5, barY + (barHeight / 2) - 5, 
           { width: labelWidth - 10, ellipsis: true });
  
  doc.roundedRect(x + labelWidth + 10, barY, maxBarWidth, barHeight, 3)
     .fillColor(COLORS.gray.light)
     .fill();
  
  doc.roundedRect(x + labelWidth + 10, barY, barWidth, barHeight, 3)
     .fillColor(item.color)
     .fill()
     .strokeColor(COLORS.gray.primary)
     .lineWidth(0.5)
     .stroke();
  
  if (barWidth > 30) {
    doc.fontSize(10)
       .fillColor('#ffffff')
       .font('Helvetica-Bold')
       .text(item.value.toString(), 
             x + labelWidth + 15, 
             barY + (barHeight / 2) - 5,
             { width: barWidth - 10 });
  }
  
  doc.fontSize(10)
     .fillColor(COLORS.gray.secondary)
     .text(`${item.percentage}%`,
           x + labelWidth + barWidth + 20,
           barY + (barHeight / 2) - 5);
});
}

function drawExpiryTimelineChart(doc, products, pageWidth) {
drawSectionHeader(doc, 'EXPIRY TIMELINE ANALYSIS', pageWidth);

const chartHeight = 160;
const chartWidth = pageWidth - 80;
const chartX = 40;
let chartY = doc.y + 20;

if (chartY + chartHeight + 60 > doc.page.height - 100) {
  doc.addPage();
  chartY = 50;
}

doc.roundedRect(chartX, chartY, chartWidth, chartHeight, 8)
   .fillColor('#ffffff')
   .fill()
   .strokeColor(COLORS.gray.primary)
   .lineWidth(1)
   .stroke();

const timelineData = calculateExpiryTimeline(products);

if (timelineData.length === 0) {
  doc.fontSize(12)
     .fillColor(COLORS.gray.primary)
     .font('Helvetica-Bold')
     .text('No expiry data available for timeline analysis.',
           chartX + 20, chartY + 60,
           { width: chartWidth - 40, align: 'center' });
  return;
}

const gridLines = 5;
for (let i = 0; i < gridLines; i++) {
  const y = chartY + 20 + (i * ((chartHeight - 40) / (gridLines - 1)));
  doc.moveTo(chartX + 20, y)
     .lineTo(chartX + chartWidth - 20, y)
     .strokeColor(COLORS.gray.primary, 0.2)
     .lineWidth(1)
     .stroke();
}

const maxValue = Math.max(...timelineData.map(d => d.count), 1);
const barWidth = (chartWidth - 60) / timelineData.length - 10;

// Draw bars and labels
timelineData.forEach((item, index) => {
  const x = chartX + 30 + (index * ((chartWidth - 60) / timelineData.length));
  const barHeight = (item.count / maxValue) * (chartHeight - 60);
  const y = chartY + chartHeight - 30 - barHeight;
  
  // Bar shadow
  doc.roundedRect(x + 2, y + 2, barWidth, barHeight, 4)
     .fillColor('#000000', 0.1)
     .fill();
  
  // Bar with gradient effect
  const barColor = item.isCurrentMonth ? COLORS.red.primary :
                  item.count > maxValue/2 ? COLORS.blue.primary :
                  COLORS.blue.secondary;
  
  doc.roundedRect(x, y, barWidth, barHeight, 4)
     .fillColor(barColor)
     .fill();
  
  // Value label if count > 0
  if (item.count > 0) {
    // Value background
    doc.roundedRect(x - 5, y - 20, barWidth + 10, 16, 3)
       .fillColor('#ffffff')
       .fill()
       .strokeColor(COLORS.gray.primary)
       .lineWidth(0.5)
       .stroke();
    
    // Value text
    doc.fontSize(10)
       .fillColor(COLORS.gray.secondary)
       .font('Helvetica-Bold')
       .text(item.count.toString(),
             x - 5, y - 18,
             { width: barWidth + 10, align: 'center' });
  }
  
  // Month label
  const labelY = chartY + chartHeight - 20;
  
  // Month label background
  doc.roundedRect(x - 5, labelY, barWidth + 10, 16, 3)
     .fillColor(item.isCurrentMonth ? COLORS.red.primary : '#ffffff')
     .fill()
     .strokeColor(COLORS.gray.primary)
     .lineWidth(0.5)
     .stroke();
  
  // Month label text
  doc.fontSize(9)
     .fillColor(item.isCurrentMonth ? '#ffffff' : COLORS.gray.secondary)
     .font(item.isCurrentMonth ? 'Helvetica-Bold' : 'Helvetica')
     .text(item.month,
           x - 5, labelY + 2,
           { width: barWidth + 10, align: 'center' });
});

// Add legend
const legendY = chartY + 10;
const legendItems = [
  { label: 'Current Month', color: COLORS.red.primary },
  { label: 'High Volume', color: COLORS.blue.primary },
  { label: 'Normal Volume', color: COLORS.blue.secondary }
];

legendItems.forEach((item, index) => {
  const legendX = chartX + chartWidth - 150;
  const itemY = legendY + (index * 20);
  
  // Legend color box
  doc.rect(legendX, itemY, 12, 12)
     .fillColor(item.color)
     .fill()
     .strokeColor(COLORS.gray.primary)
     .lineWidth(0.5)
     .stroke();
  
  // Legend text
  doc.fontSize(9)
     .fillColor(COLORS.gray.secondary)
     .font('Helvetica')
     .text(item.label, legendX + 20, itemY + 2);
});

// Update Y position
doc.y = chartY + chartHeight + 20;
}

function calculateExpiryTimeline(products) {
const now = new Date();
const timeline = [];

// Create 6-month timeline
for (let i = 0; i < 6; i++) {
  const monthStart = new Date(now.getFullYear(), now.getMonth() + i, 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + i + 1, 0);
  
  const count = products.filter(product => {
    if (!product.expiryDate) return false;
    const expiryDate = new Date(product.expiryDate);
    return expiryDate >= monthStart && expiryDate <= monthEnd;
  }).length;
  
  timeline.push({
    month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    count: count,
    isCurrentMonth: i === 0
  });
}

return timeline;
}

function drawTimelineBackground(doc, x, y, width, height) {
// Chart background
doc.roundedRect(x, y, width, height, 5)
   .fillColor('#f8fafc')
   .fill()
   .stroke('#e2e8f0');

// Grid lines
for (let i = 1; i < 5; i++) {
  const gridY = y + (height / 5) * i;
  doc.moveTo(x + 10, gridY)
     .lineTo(x + width - 10, gridY)
     .strokeColor('#e5e7eb')
     .lineWidth(0.5)
     .stroke();
}
}

function drawTimelineBars(doc, data, x, y, width, height) {
const maxValue = Math.max(...data.map(item => item.value));
const barHeight = Math.min(25, (height - 20) / data.length - 10); // Limit bar height
const maxBarWidth = width - 180; // More space for labels
const labelWidth = 120;

// Draw chart background
doc.roundedRect(x, y - 10, width, height + 20, 5)
   .fillColor('#ffffff')
   .fill()
   .strokeColor(COLORS.gray.primary)
   .lineWidth(1)
   .stroke();

data.forEach((item, index) => {
  const barY = y + (index * (barHeight + 10));
  const barWidth = Math.max(2, (item.value / maxValue) * maxBarWidth); // Minimum bar width
  
  // Label background
  doc.roundedRect(x, barY, labelWidth, barHeight, 3)
     .fillColor('#ffffff')
     .fill()
     .strokeColor(COLORS.gray.primary)
     .lineWidth(0.5)
     .stroke();
  
  // Label with ellipsis if needed
  doc.fontSize(11)
     .fillColor(COLORS.gray.secondary)
     .font('Helvetica-Bold')
     .text(item.label, x + 5, barY + (barHeight / 2) - 5, 
           { width: labelWidth - 10, ellipsis: true });
  
  // Bar background
  doc.roundedRect(x + labelWidth + 10, barY, maxBarWidth, barHeight, 3)
     .fillColor(COLORS.gray.light)
     .fill();
  
  // Data bar
  doc.roundedRect(x + labelWidth + 10, barY, barWidth, barHeight, 3)
     .fillColor(item.color)
     .fill()
     .strokeColor(COLORS.gray.primary)
     .lineWidth(0.5)
     .stroke();
  
  // Value and percentage with proper spacing
  if (barWidth > 30) { // Only show value if bar is wide enough
    doc.fontSize(10)
       .fillColor('#ffffff')
       .font('Helvetica-Bold')
       .text(item.value.toString(), 
             x + labelWidth + 15, 
             barY + (barHeight / 2) - 5,
             { width: barWidth - 10 });
  }
  
  // Percentage always shown at the end
  doc.fontSize(10)
     .fillColor(COLORS.gray.secondary)
     .text(`${item.percentage}%`,
           x + labelWidth + barWidth + 20,
           barY + (barHeight / 2) - 5);
});
}

function drawTimelineLabels(doc, data, x, y, width, height) {
const barWidth = (width - 40) / data.length - 10;

data.forEach((item, index) => {
  const labelX = x + 20 + (index * (barWidth + 10));
  const labelY = y + height + 5;
  
  doc.fontSize(9)
     .fillColor(item.isCurrentMonth ? '#ef4444' : '#6b7280')
     .font(item.isCurrentMonth ? 'Helvetica-Bold' : 'Helvetica')
     .text(item.month, labelX, labelY, { width: barWidth, align: 'center' });
});
}

function calculateOverallRisk(risks) {
let score = 0;
risks.forEach(risk => {
  switch(risk.level) {
    case 'high': score += 30; break;
    case 'medium': score += 15; break;
    case 'low': score += 5; break;
  }
});

score = Math.min(100, score);
let level = 'low';
if (score > 70) level = 'high';
else if (score > 40) level = 'medium';

return { score, level };
}

function calculateMonthlyExpiryTrend(products) {
// Calculate 12-month expiry trend
const now = new Date();
const monthlyData = [];

for (let i = -6; i <= 5; i++) {
  const monthStart = new Date(now.getFullYear(), now.getMonth() + i, 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + i + 1, 0);
  
  const expired = products.filter(product => {
    if (!product.expiryDate) return false;
    const expiryDate = new Date(product.expiryDate);
    return expiryDate >= monthStart && expiryDate <= monthEnd;
  }).length;
  
  monthlyData.push({
    month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
    value: expired,
    isPast: i < 0,
    isCurrent: i === 0
  });
}

return monthlyData;
}

function drawTrendLine(doc, data, pageWidth) {
const chartHeight = 120;
const chartWidth = pageWidth - 100;
const chartX = 50;
const chartY = doc.y + 20;
const labelHeight = 20;
const labelSpacing = 5;

// Background
doc.roundedRect(chartX, chartY, chartWidth, chartHeight + labelHeight + labelSpacing, 5)
   .fillColor('#ffffff')
   .fill()
   .strokeColor(COLORS.gray.primary)
   .lineWidth(1)
   .stroke();

// Grid lines
const gridLines = 5;
for (let i = 0; i < gridLines; i++) {
  const y = chartY + (i * (chartHeight / (gridLines - 1)));
  doc.moveTo(chartX + 10, y)
     .lineTo(chartX + chartWidth - 10, y)
     .strokeColor(COLORS.gray.primary)
     .lineWidth(0.5)
     .stroke();
}

const maxValue = Math.max(...data.map(d => d.value), 1);
const stepX = (chartWidth - 60) / (data.length - 1);

// Draw trend line
doc.save();
data.forEach((point, index) => {
  const x = chartX + 30 + (index * stepX);
  const normalizedValue = point.value / maxValue;
  const y = chartY + chartHeight - 20 - (normalizedValue * (chartHeight - 40));
  
  if (index === 0) {
    doc.moveTo(x, y);
  } else {
    doc.lineTo(x, y);
  }
  
  // Data points
  doc.circle(x, y, 4)
     .fillColor(point.isCurrent ? COLORS.red.primary : COLORS.blue.primary)
     .fill()
     .strokeColor('#ffffff')
     .lineWidth(2)
     .stroke();
  
  // Value labels with proper spacing
  if (point.value > 0) {
    const labelY = y - 20;
    doc.roundedRect(x - 15, labelY, 30, 16, 2)
       .fillColor('#ffffff')
       .fill()
       .strokeColor(COLORS.gray.primary)
       .lineWidth(0.5)
       .stroke();
    
    doc.fontSize(10)
       .fillColor(COLORS.gray.secondary)
       .font('Helvetica-Bold')
       .text(point.value.toString(), x - 15, labelY + 4, 
             { width: 30, align: 'center' });
  }
  
  // Month labels at the bottom with proper spacing
  const monthLabelY = chartY + chartHeight + labelSpacing;
  doc.fontSize(9)
     .fillColor(point.isCurrent ? COLORS.red.primary : COLORS.gray.secondary)
     .font(point.isCurrent ? 'Helvetica-Bold' : 'Helvetica')
     .text(point.month, x - 20, monthLabelY, 
           { width: 40, align: 'center' });
});

// Draw the trend line after all points
doc.strokeColor(COLORS.blue.primary)
   .lineWidth(2)
   .stroke();
doc.restore();

doc.y = chartY + chartHeight + labelHeight + labelSpacing + 10;
}

function drawEnhancedTable(doc, products, headers, colWidths, startX) {
let currentY = doc.y;
const tableWidth = colWidths.reduce((sum, width) => sum + width, 0);
const rowHeight = 25;
const maxY = doc.page.height - 100; // Leave space for footer

// Enhanced header
doc.roundedRect(startX, currentY, tableWidth, rowHeight, 5)
   .fillColor('#1e293b')
   .fill();

doc.fillColor('#ffffff')
   .fontSize(10)
   .font('Helvetica-Bold');

let x = startX;
headers.forEach((header, index) => {
  doc.text(header, x + 8, currentY + 8, { 
    width: colWidths[index] - 16, 
    align: 'left' 
  });
  x += colWidths[index];
});

currentY += rowHeight;
doc.fillColor('#000000').font('Helvetica');

// Calculate if we need multiple pages
const rowsPerPage = Math.floor((maxY - doc.y) / rowHeight);
const totalPages = Math.ceil(products.length / rowsPerPage);
let currentPage = 1;

// Data rows with enhanced styling
products.forEach((product, index) => {
  // Check for page break
  if (currentY > maxY) {
    if (currentPage < totalPages) {
      doc.addPage();
      currentY = 80;
      currentPage++;
      
      // Redraw header on new page
      doc.roundedRect(startX, currentY, tableWidth, rowHeight, 5)
         .fillColor('#1e293b')
         .fill();
      
      doc.fillColor('#ffffff')
         .fontSize(10)
         .font('Helvetica-Bold');
      
      let headerX = startX;
      headers.forEach((header, headerIndex) => {
        doc.text(header, headerX + 8, currentY + 8, { 
          width: colWidths[headerIndex] - 16, 
          align: 'left' 
        });
        headerX += colWidths[headerIndex];
      });
      
      currentY += rowHeight;
      doc.fillColor('#000000').font('Helvetica');
    }
  }
  
  // Row background with alternating colors
  const bgColor = index % 2 === 0 ? '#ffffff' : '#f8fafc';
  doc.rect(startX, currentY, tableWidth, rowHeight)
     .fillColor(bgColor)
     .fill();
  
  // Status-based row highlighting
  const status = getProductStatus(product);
  if (status === 'Expired') {
    doc.rect(startX, currentY, 3, rowHeight)
       .fillColor('#ef4444')
       .fill();
  } else if (status === 'Expiring Soon') {
    doc.rect(startX, currentY, 3, rowHeight)
       .fillColor('#f59e0b')
       .fill();
  }
  
  // Calculate risk level
  const riskLevel = calculateProductRisk(product);
  
  const rowData = [
    (index + 1).toString(),
    product.name || 'N/A',
    product.Category ? product.Category.name : 'Uncategorized',
    product.barcode || 'N/A',
    product.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : 'N/A',
    status || 'Unknown',
    riskLevel
  ];
  
  let cellX = startX;
  rowData.forEach((data, cellIndex) => {
    // Special formatting for status column
    if (cellIndex === 5) {
      const statusColor = getStatusColor(data);
      doc.fillColor(statusColor);
    } else if (cellIndex === 6) {
      const riskColor = getRiskColor(data.toLowerCase());
      doc.fillColor(riskColor);
    } else {
      doc.fillColor('#374151');
    }
    
    doc.fontSize(9)
       .text(data, cellX + 8, currentY + 8, { 
         width: colWidths[cellIndex] - 16, 
         height: rowHeight - 10,
         ellipsis: true
       });
    
    cellX += colWidths[cellIndex];
  });
  
  currentY += rowHeight;
});

// Table border
doc.rect(startX, doc.y, tableWidth, currentY - doc.y)
   .strokeColor('#e2e8f0')
   .lineWidth(1)
   .stroke();

doc.y = currentY + 20;
}

function calculateProductRisk(product) {
if (!product.expiryDate) return 'Low';

const now = new Date();
const expiryDate = new Date(product.expiryDate);
const daysToExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

if (daysToExpiry < 0) return 'Critical';
if (daysToExpiry <= 7) return 'High';
if (daysToExpiry <= 30) return 'Medium';
return 'Low';
}

function getStatusColor(status) {
const colors = {
  'Fresh': '#10b981',
  'Expiring Soon': '#f59e0b',
  'Expired': '#ef4444',
  'Unknown': '#6b7280'
};
return colors[status] || '#6b7280';
}

// Enhanced pie chart implementation
function drawPieChart(doc, data, centerX, centerY, radius) {
const total = data.reduce((sum, item) => sum + item.value, 0);

if (total === 0) {
  doc.circle(centerX, centerY, radius)
     .strokeColor('#e5e7eb')
     .lineWidth(2)
     .stroke();
  
  doc.fontSize(12)
     .fillColor('#9ca3af')
     .text('No data', centerX - 25, centerY - 6, { width: 50, align: 'center' });
  return;
}

let currentAngle = -90; // Start from top

data.forEach((item, index) => {
  if (item.value > 0) {
    const sliceAngle = (item.value / total) * 360;
    
    // Draw slice with enhanced styling
    doc.save();
    
    // Shadow effect
    const shadowOffset = 2;
    doc.moveTo(centerX + shadowOffset, centerY + shadowOffset);
    doc.arc(centerX + shadowOffset, centerY + shadowOffset, radius, 
            currentAngle * Math.PI / 180, 
            (currentAngle + sliceAngle) * Math.PI / 180);
    doc.closePath();
    doc.fillColor('#000000', 0.1);
    doc.fill();
    
    // Main slice
    doc.moveTo(centerX, centerY);
    doc.arc(centerX, centerY, radius, 
            currentAngle * Math.PI / 180, 
            (currentAngle + sliceAngle) * Math.PI / 180);
    doc.closePath();
    doc.fillColor(item.color);
    doc.fill();
    
    // Slice border
    doc.strokeColor('#ffffff');
    doc.lineWidth(2);
    doc.stroke();
    
    doc.restore();
    currentAngle += sliceAngle;
  }
});

// Center circle for donut effect
doc.circle(centerX, centerY, radius * 0.4)
   .fillColor('#ffffff')
   .fill()
   .strokeColor('#e5e7eb')
   .lineWidth(1)
   .stroke();

// Center text
doc.fontSize(14)
   .fillColor('#374151')
   .font('Helvetica-Bold')
   .text(total.toString(), centerX - 15, centerY - 10, { width: 30, align: 'center' });

doc.fontSize(8)
   .fillColor('#6b7280')
   .font('Helvetica')
   .text('Total', centerX - 15, centerY + 5, { width: 30, align: 'center' });
}


module.exports = {pdfGenerator}