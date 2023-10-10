module.exports = {
	root: true,
	env: {
		es6: true,
		node: true
	},
	extends: [
		'eslint:recommended',
		'plugin:import/errors',
		'plugin:import/warnings',
		'plugin:import/typescript',
		'google',
		'plugin:@typescript-eslint/recommended'
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: ['tsconfig.json', 'tsconfig.dev.json'],
		sourceType: 'module'
	},
	ignorePatterns: [
		'/lib/**/*' // Ignore built files.
	],
	plugins: ['@typescript-eslint', 'import'],
	rules: {
		'max-len': ['warn', 1500],
		'object-curly-spacing': ['warn', 'never'],
		'quote-props': ['warn', 'consistent-as-needed'],
		indent: ['warn', 2],
		quotes: ['error', 'single'],
		'import/no-unresolved': 0,
		'no-tabs': 'off',
		'comma-dangle': 'off',
		'@typescript-eslint/no-var-requires': 'off'
	}
};
