import StyleDictionary from 'style-dictionary';

/**
 * Style Dictionary Configuration
 * Generates tokens.css from tokens/tokens.json
 */
export default {
  source: ['tokens/tokens.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'src/styles/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: {
            outputReferences: true,
            selector: ':root',
          },
        },
      ],
      transforms: ['attribute/cti', 'name/kebab', 'time/seconds', 'color/css'],
    },
  },
};
