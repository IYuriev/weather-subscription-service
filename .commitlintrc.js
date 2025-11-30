module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test'
      ]
    ],
    'header-max-length': [2, 'always', 100]
  },
  ignores: [
    (message) => message.includes('GitHub Classroom Feedback'),
    (message) => message.includes('Setting up GitHub Classroom Feedback')
  ]
};