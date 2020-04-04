set -o errexit
target_dir="$PWD/build/app"
src=`realpath $PWD/..`
rm -rf "$target_dir" || true
dotnet publish -c Release $src/server/ -o "$target_dir" 
( cd $src/client && npx ng build --prod --aot --outputPath="$target_dir/wwwroot")