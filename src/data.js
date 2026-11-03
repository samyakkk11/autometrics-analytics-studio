// ===== ALL CONTENT LIVES HERE. Edit text, add projects, change stats. =====
const imgs = import.meta.glob('./img/*.jpg', { eager: true, query: '?url', import: 'default' })
export const IMG = (k) => imgs[`./img/${k}.jpg`]

export const SKILLS = [
  ['python', 'Python', 'Cleaning, validation, and analytical pipelines.'],
  ['sql', 'SQL', 'Querying, transformation, and analytical data workflows.'],
  ['powerbi', 'Power BI', 'Data models, interactive dashboards, and reporting.'],
  ['dax', 'DAX', 'Measures, year-over-year growth, field parameters, and What-If scenarios.'],
  ['powerquery', 'Power Query', 'Ingesting, cleaning, and reshaping source tables.'],
  ['excel', 'Excel', 'Spreadsheet models and reporting.'],
  ['pandas', 'pandas', 'Data profiling, cleaning, and customer segmentation.'],
  ['github', 'Git and GitHub', 'Version-controlled projects and documentation.'],
]
export const STACK = ['python', 'sql', 'pandas', 'duckdb', 'powerbi', 'dax', 'powerquery', 'excel', 'scikitlearn', 'scipy', 'apacheparquet', 'git', 'github']

export const STAGES = [
  ['Discover', 'Understand the business question', 'We clarify business objectives, available data, stakeholders, and the decision this work needs to support.', 'Scope, audience, and success criteria are agreed before analysis begins.'],
  ['Prepare', 'Assess and prepare the data', 'We inspect, clean, validate, and organize the available data while documenting gaps and limitations.', 'Data quality and assumptions stay visible throughout the work.'],
  ['Analyze', 'Investigate patterns and findings', 'We explore trends, compare relevant groups, and use suitable methods to develop meaningful findings.', 'Conclusions stay grounded in the available data.'],
  ['Deliver', 'Explain and hand over', 'We present insights through dashboards, reports, analytical outputs, or automated workflows, with agreed documentation.', 'We discuss practical next steps and any ongoing support.'],
]

export const PROJECTS = [
  { t: 'Customer Retention and RFM Segmentation', short: 'Retention', k: 'Python · Power BI · public synthetic Kaggle dataset', repo: 'https://github.com/samyakkk11/Customer-Retention-Analysis',
    prob: 'An online store has 100,000 sign-ups but only 30.6% ever bought. Who is worth keeping, where do sales leak, and does a win-back campaign pay off?',
    stats: [['30.6', '%', 'of sign-ups ever bought'], ['44.6', '%', 'of orders cancelled'], ['1,772', '', 'big spenders gone quiet']],
    shots: [['ret_The_Big_Picture', 'The big picture'], ['ret_Where_we_lose_sales', 'Where we lose sales'], ['ret_What_to_do', 'What to do first']],
    cs: { problem: 'Most registered customers never buy and nearly half of all orders are cancelled, so a retention budget needs to go to the right group first.', obj: 'Segment buyers, locate the sales leak and size a win-back campaign with adjustable assumptions.',
      data: 'Kaggle E-Commerce Customer Behavior dataset: 100,000 customers, 30,622 buyers. It is synthetic, and several columns behave like random noise, so the findings show the method, not real market facts. The Amazon logo in the dashboard is decorative; no Amazon data is used and the project is not affiliated with Amazon.',
      prep: 'Sign-ups separated from buyers, cancelled orders identified, and recency, frequency and spend calculated per buyer.', meth: 'RFM scoring in quintiles into six segments, cancellation breakdowns, and a break-even model for a win-back campaign in Power BI.',
      find: ['30.6% of sign-ups have a completed order; about 18,300 bought more than once.', 'At-Risk is the largest segment by revenue (34.0% of buyer revenue), ahead of Champions (27.3%).', '44.6% of orders are cancelled, and 20,128 customers had every order cancelled.', 'About 1,772 big spenders have gone quiet and hold 17.3% of buyer revenue.'],
      rec: ['Start with a small, tested win-back offer for the 1,772 high-spending customers who went quiet, then scale only if it pays off.', 'Investigate cancellations first, because the leak is about equal in every category.'], tools: ['python', 'pandas', 'scikitlearn', 'scipy', 'powerbi', 'dax'] } },
  { t: 'Indian Mutual Fund Intelligence', short: 'Mutual funds', k: 'Python · DuckDB · SQL · Power BI · AMFI NAV data', repo: 'https://github.com/samyakkk11/indian-mutual-fund-intelligence',
    prob: 'How are Indian mutual funds spread across categories and AMCs, and how do their returns and risk compare, using data that is validated before it reaches the dashboard?',
    stats: [['1,737', '', 'schemes analysed'], ['52', '', 'AMCs covered'], ['20', '', 'NAV-break schemes excluded']],
    shots: [['mf_overview', 'Executive overview'], ['mf_category', 'Category and AMC landscape'], ['mf_performance', 'Performance and risk'], ['mf_fund', 'Fund explorer']],
    cs: { problem: 'Understand how the Indian mutual fund market is distributed and how returns and risk differ, using data that has been validated before it reaches the dashboard.', obj: 'Build a reproducible pipeline that answers practical questions on category, AMC, fund age, performance versus category, and abnormal NAV movements.',
      data: 'Compiled AMFI mutual fund NAV data, a static snapshot through 05-Sep-2026, narrowed to 1,737 Active Direct-Growth schemes from 52 AMCs.', prep: 'Data profiling, DuckDB modelling, NAV anomaly detection and validation checks, then Parquet exports as the Power BI input.',
      meth: 'SQL window functions for 1Y, 3Y and 5Y returns, CAGR, volatility and maximum drawdown, with fund-versus-category comparison.',
      find: ['21 NAV break events affected 20 of 1,757 schemes (1.14%), across liquid, overnight, money market, ultra-short, short-term, corporate bond and gilt funds.', 'An overnight fund first appeared as the top 5Y performer at a 67.51% CAGR; the cause was a NAV discontinuity, not performance.', 'The final analysed universe is 1,737 schemes and 2,875,293 NAV rows.'],
      rec: ['Exclude and disclose anomalies whose cause cannot be verified, rather than silently correcting them.', 'Validate inside the pipeline: a successful run or refresh can still produce a wrong headline metric.', 'Handle blank history explicitly in DAX so young funds are not shown with a misleading -100% CAGR.'], tools: ['python', 'duckdb', 'sql', 'apacheparquet', 'powerbi'] } },
  { t: 'Samsung Supply Chain and Logistics Dashboard', short: 'Supply chain', k: 'Power BI · synthetic dataset · guided tutorial build', repo: 'https://github.com/samyakkk11/Samsung-Supply-Chain-and-Logistics',
    prob: 'Supply chain stakeholders need one view of procurement, inventory, shipping and sales to spot bottlenecks and link them to revenue and profit.',
    stats: [['75.29', '%', 'shipments delivered'], ['27.44', '%', 'profit margin'], ['573', '', 'orders delayed']],
    shots: [['sam_Overview', 'Overview'], ['sam_Supplier', 'Supplier'], ['sam_Inventory', 'Inventory'], ['sam_Shipment', 'Shipment'], ['sam_Customer', 'Customer'], ['sam_Data_model', 'Data model']],
    cs: { problem: 'Spot supplier delays, stock shortages and shipment failures, and connect them to downstream revenue and profit.', obj: 'A single source of truth across procurement, production, inventory, shipment and sales.',
      data: "AI-generated synthetic dataset, not Samsung's real data, built by following a guided tutorial. The data model, DAX measures, page structure and analysis are my own work.", prep: 'Power Query ingestion and transformation into a star schema with 1-to-many relationships and a central date dimension.',
      meth: 'DAX measures for margin, year-over-year growth, days of inventory and perfect-order rate, plus field parameters to toggle charts.',
      find: ['75.29% of shipments delivered; 573 orders delayed. Maersk Line has the most delays (87), then DHL Express (66).', 'Carrier capacity (90) and documentation issues (78) are the top causes of delay.', 'Profit margin is 27.44% on ₹176.95M total revenue; Online is the largest channel at ₹73.24M; October has the strongest year-over-year growth (113.87%).', 'Galaxy S24 Ultra has both the highest stock (25K) and the highest defect count (4.3K).'],
      rec: ['Carrier capacity and documentation checks are the first places to look when reducing delays (suggested by the delay-reason breakdown).', 'Review defects on high-stock products, where quality problems tie up the most inventory.'], tools: ['powerbi', 'dax', 'powerquery'] } },
]
