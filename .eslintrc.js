module.exports = {
    extends: [
        'plugin:react/recommended',
        'plugin:@next/next/recommended',
        'plugin:import/recommended',
        'airbnb',
    ],
    plugins: [
        'react',
        'import',
    ],
    rules: {
        indent: ['error', 4],
        curly: ['error', 'all'],
        '@next/next/link-passhref': 'off',
        'import/order': ['error', { groups: ['external', 'builtin', 'object', 'type', 'index', 'sibling', 'parent', 'internal'] }],
        'import/prefer-default-export': 'off',
        'jsx-a11y/anchor-is-valid': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
        'jsx-a11y/control-has-associated-label': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',
        'max-len': 'off',
        'no-console': ['warn'],
        'react/button-has-type': 'warn',
        'react/jsx-filename-extension': 'off',
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'react/jsx-max-props-per-line': ['error', { maximum: 1 }],
        'react/jsx-props-no-spreading': 'off',
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
        'jsx-a11y/label-has-associated-control': 'off',
        'react/jsx-no-useless-fragment': 'warn',
        'import/no-extraneous-dependencies': 'off',
        'no-unused-vars': 'warn',
        'no-use-before-define': 'warn',
        'no-shadow': 'warn',
        'jsx-a11y/heading-has-content': 'off',
        'default-case': 'warn',
        'consistent-return': 'warn',
        'react/jsx-no-constructed-context-values': 'off',
    },
    settings: {
        'import/resolver': {
            alias: {
                extensions: ['.js', '.jsx'],
                map: [
                    ['@', './'],
                ],
            },
        },
    },
    parserOptions: {
        ecmaVersion: 2020,
    },
};
