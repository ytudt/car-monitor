node build/build.js
cp -R flash/ ./dist
cp -R dist/ ../ytudt.github.io
cd ../ytudt.github.io
git add -A
git commit -m "发布"
git push
rm -rf index.html
rm -rf static
cd ../car-monitor
