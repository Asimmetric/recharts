COMMIT_COUNT=$(git rev-list --count master)
echo "Creating release v1.0.$COMMIT_COUNT on recharts repo"
RELEASE_ID=$(curl --data "{\"tag_name\": \"v1.0.$COMMIT_COUNT\", \"target_commitish\": \"master\", \"name\": \"v1.0.$COMMIT_COUNT\", \"draft\": true, \"prerelease\": false}" https://api.github.com/repos/Asimmetric/recharts/releases?access_token=$GITHUB_AUTH_TOKEN | python -c "import sys, json; print json.load(sys.stdin)['id']")
echo "Creating distribution tarball"
tar -cvzf release.tar.gz README.md package.json LICENSE umd/ lib/ es6/
echo "Uploading tarball artifact to release"
curl -XPOST -H "Authorization:token $GITHUB_AUTH_TOKEN" -H "Content-Type:application/octet-stream" --data-binary @release.tar.gz https://uploads.github.com/repos/Asimmetric/recharts/releases/$RELEASE_ID/assets?name=release.tar.gz