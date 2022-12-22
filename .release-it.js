module.exports = {
  "git": {
	  "requireBranch": "release",
    "commitMessage": "chore: release v${version}"
  },
  "github": {
    "release": true,
	  "releaseName": "Version ${version}",
  },
	"hooks": {
		"before:init": ["yarn mocha", "yarn build"],
	}
};
