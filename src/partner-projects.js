export const PARTNER_PROJECTS = [
  {
    title: 'GamePulse Market Intelligence', owner: 'Shantilal657',
    repo: 'https://github.com/Shantilal657/GamePulse-Market-Intelligence', image: '/partner-projects/gamepulse-overview.png',
    alt: 'Executive overview dashboard for the Steam games market', category: 'Market intelligence · Gaming',
    summary: 'Analyzed 71,649 Steam games to compare pricing, ratings, release trends, and player interest.',
    data: 'Steam games catalogue with 71,649 titles. The repository does not identify the original data source.',
    stats: [['71,649', '', 'games analyzed'], ['84.95', '%', 'average rating'], ['$4.64', '', 'average price']],
    tools: ['PostgreSQL', 'SQL', 'Python', 'Pandas', 'SciPy', 'Power BI'],
    proof: ['ETL pipeline from CSV through PostgreSQL to Power BI', 'Three dashboard pages for overview, pricing and discounts', 'Repository reports a -0.12 price-rating correlation'], attribution: 'Partner Project',
  },
  {
    title: 'Vendor Performance Analysis', owner: 'Shantilal657',
    repo: 'https://github.com/Shantilal657/Vendor-Performance-Analysis', image: '/partner-projects/vendor-performance.png',
    alt: 'Vendor performance dashboard showing sales, purchases, inventory and profitability', category: 'Operations · Procurement',
    summary: 'Compared vendor sales and purchases to assess procurement, inventory, and profitability.',
    data: 'Vendor, purchase, sales, and inventory CSVs; the larger purchase and sales files are not included. The repository does not identify the data source.',
    stats: [['$441.51M', '', 'total sales'], ['$307.34M', '', 'total purchases'], ['$134.17M', '', 'gross profit']],
    tools: ['MySQL', 'SQL', 'Python', 'Pandas', 'SciPy', 'Power BI'],
    proof: ['Consolidated vendor analysis table built from SQL joins', 'Exploratory and statistical analysis in Python', 'Dashboard covers vendors, inventory and profitability'], attribution: 'Partner Project',
  },
  {
    title: 'Credit Card Financial Weekly Dashboard', owner: 'Shantilal657',
    repo: 'https://github.com/Shantilal657/Credit-Card-Financial-Weekly-Dashboard', image: '/partner-projects/credit-card-transactions.png',
    alt: 'Credit card transaction dashboard with revenue, interest and transaction analysis', category: 'Financial analytics · Banking',
    summary: 'Tracked weekly credit-card revenue, transaction activity, interest, and customer segments.',
    data: 'Customer and credit-card transaction CSVs. The repository does not identify the source or whether the data is synthetic.',
    stats: [['$57M', '', 'total revenue'], ['$7.98M', '', 'interest earned'], ['667.2K', '', 'transactions']],
    tools: ['MySQL', 'SQL', 'Power BI', 'DAX'],
    proof: ['Weekly revenue and week-over-week measures', 'Customer and transaction report views', 'Breakdowns by card category, expenditure, income and region'], attribution: 'Partner Project',
  }
]
