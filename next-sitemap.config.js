/** @type {import('next-sitemap').IConfig } */
const config = {
  siteUrl: 'https://kalavriksha.in',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/api/*', '/admin/*', '/dashboard/*', '/login/*'],
  transform: async (config, path) => {
    // Set priority and change frequency based on page importance
    let priority = 0.7;
    let changefreq = 'weekly';
    
    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path.includes('/events') || path.includes('/faq')) {
      priority = 0.9;
      changefreq = 'weekly';
    } else if (path.includes('/dashboard') || path.includes('/login') || path.includes('/admin')) {
      priority = 0.3;
      changefreq = 'monthly';
    }
    
    return {
      loc: config.loc,
      lastmod: config.lastmod,
      changefreq,
      priority,
    };
  },
};

module.exports = config;
