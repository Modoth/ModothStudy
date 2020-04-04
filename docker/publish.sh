#!/usr/bin/env bash
# usage app_CertPwd=<> app_CorsOrigins=<> app_name=<> app_port=<> ./publish.sh
set -o errexit
docker_compose=`realpath $PWD/docker-compose.sh`
rm -rf build/$app_name
mkdir -p build/$app_name
cp templates/* build/$app_name
cd build/$app_name
mv ../app ./
$docker_compose up -d --build
mv app ../