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
		"before:init": [
			//tests
			"yarn lint:nocache",
			"yarn mocha",
			"yarn ts:test",

			//build
			"yarn build",
			"yarn ts:gen",

		],
	}
};
