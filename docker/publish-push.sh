#!/usr/bin/env bash
# usage app_imageBuildServer=<server> image_name=<> image_version=<> user_name=<> ./publish-push.sh
set -o errexit
image_version=${image_version:-latest}
docker_compose=`realpath $PWD/docker-compose.sh`
rm -rf build/$image_name
mkdir -p build/$image_name
cp templates-push/* build/$image_name
cd build/$image_name
mv ../app ./
trap "mv app ../" EXIT
image_name="${user_name}/${image_name}:${image_version:-latest}"
server=$app_imageBuildServer image_name="$image_name" $docker_compose build
ssh $app_imageBuildServer docker push "$image_name"