module.exports = {
  plugins: [
    'remark-frontmatter',
    'remark-gfm',
    'remark-preset-lint-recommended',
    ['remark-validate-links', { repository: null }],
  ],
};
