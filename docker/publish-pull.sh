#!/usr/bin/env bash
# usage image_name=<> image_version=<> user_name=<> app_publishServer=<server> app_CertPwd=<> app_CorsOrigins=<> app_name=<> app_port=<> ./publish.sh
set -o errexit
docker_compose=`realpath $PWD/docker-compose.sh`
rm -rf build/$app_name
mkdir -p build/$app_name
cp templates-pull/* build/$app_name
cd build/$app_name
server=$app_publishServer $docker_compose pull
server=$app_publishServer $docker_compose up -d