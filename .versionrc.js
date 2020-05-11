module.exports = {
  scripts: {
    prerelease:
      'if [ "$(git branch --show-current)" != "release" ]; then exit 1; fi',
  },
};
