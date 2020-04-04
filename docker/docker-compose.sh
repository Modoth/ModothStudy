#!/usr/bin/env bash
set -o errexit
ssh -nNT -L $PWD/docker.sock:/var/run/docker.sock server &
ssh_pid=$!
DOCKER_HOST=unix://$PWD/docker.sock docker-compose $@
kill $ssh_pid
rm $PWD/docker.sock